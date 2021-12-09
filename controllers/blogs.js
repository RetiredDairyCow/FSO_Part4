const blogsRouter = require('express').Router()
const { findByIdAndRemove } = require('../models/blog')
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
require('express-async-errors') /*Try and Catch are not needed. Exceptions are passed to next */


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})


const getTokenFromHeader = (request) => {
  const auth = request.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
  /* Using promise chaining
  const blog = new Blog(request.body)
  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    }) */
   
   /*Using async/await */ 

   const body = request.body
   const token = getTokenFromHeader(request)
   const decodedToken = jwt.verify(token, `${process.env.SECRET}`)
   if (!decodedToken || !decodedToken.id) {
     return response.status(401).json({error: 'Not Found'})
   }
   const user = await User.findById(decodedToken.id)
   
   const blog = new Blog({
     author: body.author,
     title: body.title,
     url: body.url,
     likes: body.likes,
     user: user._id
   })

   const savedBlog = await blog.save()
   user.blogs = user.blogs.concat(savedBlog._id)
   await user.save()
   response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true },
  )
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
