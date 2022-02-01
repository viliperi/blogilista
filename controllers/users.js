const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  
  // check username and password requirements
  if (body.username.length < 3 || body.password.length < 3) {
    response.status(400).json({
      error: 'Username and password must be at least 3 characters long'
    })
  }

  // Check for dubplicate usernames
  const found = await User.findOne({ username: body.username })
  if (found) {
    response.status(400).json({
      error: 'Username already exists'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter