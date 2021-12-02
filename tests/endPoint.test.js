const mongoose = require('mongoose')
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(done => {
  done()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test.only('check total blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

afterAll(done => {
  mongoose.connection.close()
  done()
})
