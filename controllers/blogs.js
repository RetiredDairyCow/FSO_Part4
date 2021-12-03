const blogsRouter = require('express').Router()
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

module.exports = blogsRouter
