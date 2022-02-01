const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach( async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs id is defined correctly', async () => {
  const response = await api.get('/api/blogs')
  response.body.length > 0 
    ? expect(response.body[0].id).toBeDefined()
    : console.log('no content')
})

test('adding new blog succeeds', async () => {
  jest.setTimeout( async () => {
    const newBlog = {
      author: 'Eemeli Esikoinen',
      title: 'Renkaanvaihtajan ammattitaudit',
      url: 'www.sitasaamitatilaa.com',
      likes: 40
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('Renkaanvaihtajan ammattitaudit')
  }, 10000)
})

test('posting a blog that does not have property "likes" will set "likes" to 0', async () => {
  jest.setTimeout(async () => {
    const newBlog = {
      author: 'Uusi Ihminen',
      title: 'Uuden ihmisen elämä',
      url: 'www.uusielama.fi'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
    
    const allBlogs = await helper.blogsInDb()
    const selectedBlog = allBlogs.filter(blog => {
      return blog.url === 'www.uusielama.fi'
    })
  
    expect(selectedBlog[0].likes).toEqual(0)
  }, 10000)
})

test('posting a blog without title returns error "400"', async () => {
  jest.setTimeout(async () => {
    const newBlog = {
      author:'Amelia Ainokainen',
      url: 'www.yksinmaailmalla.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

  }, 10000)
})

test('posting a blog without url returns error "400"', async () => {
  const newBlog = {
    author: 'Teijo Terävä',
    title: 'Puukkojunkkarin taistelut'
  }

  jest.setTimeout(async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  }, 10000) 
})

test('deleting a blog with valid id succeeds', async () => {
  jest.setTimeout( async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  }, 10000)
})

test('updating an existing blog', async () => {
  const allBlogs = await helper.blogsInDb()
  const selectedBlog = allBlogs[0]
  const selectedBlogId = selectedBlog.id

  const updatedBlog = ({
    author: selectedBlog.author,
    title: selectedBlog.title,
    url: selectedBlog.url,
    likes: selectedBlog.likes + 1 // update
  })

  await api
    .put(`/api/blogs/${selectedBlogId}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-TYpe', /application\/json/)

  const updatedBlogList = await helper.blogsInDb()

  const updatedBloginDb = updatedBlogList.filter(blog => {
    return blog.id === selectedBlogId
  })[0]

  expect(updatedBloginDb.likes).toEqual(selectedBlog.likes + 1)
})

describe('when there is initially one user at db', () => {
  beforeEach( async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tarqqq0',
      name: 'Tero Ammattilainen',
      password: 'supersalainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200) 
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    jest.setTimeout( async () => {
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')
    }, 10000)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('new username is rejected if it is less than 3 characters long', async() => {
    const usersAtStart = await helper.usersInDb()

    // user with too short username
    const newUser = {
      username: 'ak',
      name: 'Arto Kurikka',
      password: 'invalid'
    }

    // correct error message is returned
    jest.setTimeout( async () => {
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` (`ak`) is shorter')
    }, 10000)

    // new user is not created if username is rejected
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtStart).toEqual(usersAtEnd)
  })

  test('password is rejected if it is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    // new user with too short password
    const newUser = {
      username: 'artokurikka',
      name: 'Arto Kurikka',
      password: 'iv'
    }

    // correct error message is returned
    jest.setTimeout( async () => {
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`password` (`iv`) is shorter')
    }, 10000)

    // new user is not created if password is rejected
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtStart).toEqual(usersAtEnd)
  })
})

afterAll(() => {
  mongoose.connection.close()
})