const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('of bloglist with multiple entries is calculated right', () => {
    const blogs = [
      {
        "author": "Turha Turpeinen",
        "title": "pölynimuripussin rakenne",
        "likes": 3,
        "url": "www.turhatieto.com"
      },
      {
        "author": "Turha Turpeinen",
        "title": "pölynimuripussin rakenne",
        "likes": 3,
        "url": "www.turhatieto.com"
      },
      {
        "author": "Turha Turpeinen",
        "title": "pölynimuripussin rakenne",
        "likes": 3,
        "url": "www.turhatieto.com"
      }
    ]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(9)
  })

  test('of empty blogs list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

  test('of bloglist that has only one blog equals the likes of that', () => {
    const blogs = [
      {
        "author": "Turha Turpeinen",
        "title": "pölynimuripussin rakenne",
        "likes": 2,
        "url": "www.turhatieto.com"
      }
    ]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(2)
  })
})

describe('favourite blog', () => {
  test('of multiple blogs', () => {
    const blogs = [
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      },
      {
        title: "Happy new year",
        author: "Anna Belle",
        likes: 25
      },
      {
        title: "Scientist's best friend",
        author: "Amber Deinstein",
        likes: 15
      }
    ]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(
      {
        title: "Happy new year",
        author: "Anna Belle",
        likes: 25
      }
    )
  })

  test('of empty list is empty list []', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual([])
  })
})

describe('Author with most blogs', () => {
  test('in the list of multiple blogs', () => {
    const blogs = [
      {
        title: "Happy new year",
        author: "Anna Belle",
        likes: 25
      },
      {
        title: "Merry Christmas",
        author: "Anna Belle",
        likes: 25
      },
      {
        title: "Science rules the world",
        author: "Amber Deinstein",
        likes: 35
      }
    ]

    const result = listHelper.mostBlogs(blogs)

    expect(result).toEqual(
      {
        author: "Anna Belle",
        blogs: 2
      }
    )
  })
})

describe('the most total likes', () => {
  test('of multiple authors', () => {
    const blogs = [
      {
        title: "Happy new year",
        author: "Anna Belle",
        likes: 25
      },
      {
        title: "Science rules the world",
        author: "Amber Deinstein",
        likes: 35
      },
      {
        title: "Merry Christmas",
        author: "Anna Belle",
        likes: 25
      }
    ]

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(
      {
        author: "Anna Belle",
        likes: 50
      }
    )
  })
})