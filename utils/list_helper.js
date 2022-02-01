const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce( (sum, blog) => {
    return sum + blog.likes
  }, 0)
  return likes
}

const favoriteBlog = blogs => {
  let max = 0
  let blogWithHighestLikes = []

  blogs.map(blog => {
    if (blog.likes >= max) {
      max = blog.likes
      blogWithHighestLikes = blog
    }
  })

  return blogWithHighestLikes
}

const mostBlogs = blogs => {
  const mostBlogs = _(blogs)
    .groupBy('author')
    .map( (blog, key) => ({
      'author': key,
      'blogs': blog.length
    }))
    .value()

  const result = _.maxBy(mostBlogs, 'blogs')
  
  return result
}

const mostLikes = blogs => {
  const totalLikesofBloggers = _(blogs)
    .groupBy('author')
    .map( (blog, key) => ({
      'author': key,
      'likes': _.sumBy(blog, 'likes')
    }))
    .value()

  const result = _.maxBy(totalLikesofBloggers, 'likes')

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}