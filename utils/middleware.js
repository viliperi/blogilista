const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase(). startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  request.user = user

  next()
} 

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log('ErrorHandler is called')

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  logger.error(error.message)

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}