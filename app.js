const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')
const mongoose = require('mongoose')




app.use(express.json()) /*call this before request looger middleware or else it won't be able to parse JSON body*/
app.use(middleware.requestLogger)
app.use(cors())
app.use('/api/blogs', blogsRouter)

module.exports = app
