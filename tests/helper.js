const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    author: 'Turha Turpeinen',
    title: 'pölynimuripussin rakenne',
    likes: 6,
    url: 'www.pussitieto.com'
  },
  {
    author: 'Kaisa Kakkonen',
    title: 'Aidanrakennuksen ABC',
    likes: 32,
    url: 'www.aitakaisa.com'
  },
  {
    author: 'Erno Sahalaita',
    title: 'Moottorisahan toiminta',
    likes: 60,
    url: 'www.saha-aitta.com'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { 
  initialBlogs, 
  blogsInDb,
  usersInDb
}