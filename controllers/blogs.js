const blogsRouter = require('express').Router()
const { findByIdAndRemove } = require('../models/blog')
const Blog = require('../models/blog')
require('express-async-errors') /*Try and Catch are not needed. Exceptions are passed to next */

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  /* const blog = new Blog(request.body)

  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    }) */
    
   
  const newBlog = new Blog(request.body)
  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
   
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
