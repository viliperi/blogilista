const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  console.log(user)

  const blog = new Blog({
    author: body.author,
    title: body.title === undefined ? response.status(400) : body.title,
    url: body.url === undefined ? response.status(400) : body.url,
    likes: body.likes === undefined ? body.likes = 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    response.status(404).json({ error: 'Blog not found.'})
  }

  const user = request.user
  const userId = user._id.toString()

  if (userId === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'user has no rights to modify/delete other users blogs'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(returnedBlog.toJSON())
})

module.exports = blogsRouter