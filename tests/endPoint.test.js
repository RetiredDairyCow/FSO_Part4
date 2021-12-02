const mongoose = require('mongoose')
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  /* In parallel */
  const blogObjects = helper.initialBlogs
    .map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save()) 
  const result = await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('check total blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test.only('check _id is transformed into id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  expect(firstBlog.id).toBeDefined()

})

afterAll(done => {
  mongoose.connection.close()
  done()
})
