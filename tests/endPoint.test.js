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

test('check _id is transformed into id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  expect(firstBlog.id).toBeDefined()

})

test('Adding/Posting a blog', async () => {
  const newBlog = {
    title : 'my blog post test',
    author : 'radical rishi',
    url : 'radicalLeftRishiStrikesAgain.com',
    likes : 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('my blog post test')
})

test('Missing likes should produce an error ', async () => {
  
  const newBlog = {
    title : 'my blog post test',
    author : 'radical rishi',
    url : 'radicalLeftRishiStrikesAgain.com',
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).not.toContain(newBlog)
})

test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Ash Ash',
    url: 'http://fb.com',
  }

  const result = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const createdBlog = result.body
  console.log(createdBlog)
  expect(createdBlog.likes).toBe(0)
})

test.only('Check for missing title and url', async () => {
  const newBlog = {
    author: 'ash ash',
    likes: 7
  }

  const result = await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)    
})

afterAll(done => {
  mongoose.connection.close()
  done()
})
