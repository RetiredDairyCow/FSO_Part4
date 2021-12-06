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
  expect(createdBlog.likes).toBe(0)
})

test('Check for missing title and url', async () => {
  const newBlog = {
    author: 'ash ash',
    likes: 7
  }
  
  const result = await api.post('/api/blogs')
  .send(newBlog)
  .expect(400)    
})

test('Blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  
  const res = await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
})

test('Blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  
  const newBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }
  
  const result = await api.put(`/api/blogs/${newBlog.id}`)
  .send(newBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)
  const updatedBlog = result.body
  expect(updatedBlog.likes).toBe(newBlog.likes)
})

afterAll(done => {
  mongoose.connection.close()
  done()
})

/**This test is not required since the model defaults missing likes to 0
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
}) */