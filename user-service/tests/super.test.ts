import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => await db.close())

describe('get', () => {
  describe('GET /', () => {
    test('successful', async () => {
      const res = await agent.get('/').send()
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('Hello World from user-service')
      expect(res.body).toBeTruthy()
    })
  })
})

describe('signup', () => {
  describe('POST /', () => {
    test('successful', async () => {
      const res = await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeTruthy()
    })
    test('failed duplicate creation', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      const res = await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      expect(res.statusCode).toEqual(500)
    })
    test('bad username', async () => {
      const res = await agent.post('/signup').send({ username: ' ', password: 'testpw' })
      expect(res.statusCode).toEqual(500)
    })
  })
})

describe('login', () => {
  describe('POST /', () => {
    test('successful', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      const res = await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      expect(res.statusCode).toEqual(200)
    })
    test('wrong account fail', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      const res = await agent.post('/login').send({ username: 'user2', password: 'testpw' })
      expect(res.statusCode).toEqual(401)
    })
    test('no account fail', async () => {
      const res = await agent.post('/login').send({ username: 'user2', password: 'testpw' })
      expect(res.statusCode).toEqual(401)
    })
  })
})

describe('auth', () => {
  describe('get /', () => {
    test('fail_without_login', async () => {
      const res = await agent.get('/auth')
      expect(res.statusCode).toEqual(401)
    })
    test('successful', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      const res = await agent.get('/auth')
      expect(res.statusCode).toEqual(200)
    })
  })
})

describe('logout', () => {
  describe('get /', () => {
    test('fail without login', async () => {
      const res = await agent.post('/logout').send()
      expect(res.statusCode).toEqual(401)
    })
    test('logout of account', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      const res = await agent.post('/logout').send()
      expect(res.statusCode).toEqual(200)
    })
    test('no auth after logout', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      await agent.post('/logout').send()
      const res = await agent.get('/auth')
      expect(res.statusCode).toEqual(401)
    })
    test('relogin', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      await agent.post('/logout').send()
      const res = await agent.get('/auth')
      expect(res.statusCode).toEqual(401)
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      const res2 = await agent.get('/auth')
      expect(res2.statusCode).toEqual(200)
    })
  })
})

describe('change credentials', () => {
  describe('get /', () => {
    test('fail without login', async () => {
      const res = await agent.put('/changeUsername').send({ username: 'user1', password: 'testpw' })
      expect(res.statusCode).toEqual(401)
      const res1 = await agent.put('/changePassword').send({ username: 'user1', password: 'testpw' })
      expect(res1.statusCode).toEqual(401)
    })
    test('change username', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      await agent.put('/changeUsername').send({ username: 'user2', password: 'testpw' })
      const res = await agent.post('/login').send({ username: 'user2', password: 'testpw' })
      expect(res.statusCode).toEqual(200)
      const res1 = await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      expect(res1.statusCode).toEqual(401)
    })
    test('change password', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      await agent.put('/changePassword').send({ username: 'user1', password: 'testpw2' })
      const res = await agent.post('/login').send({ username: 'user1', password: 'testpw2' })
      expect(res.statusCode).toEqual(200)
      const res1 = await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      expect(res1.statusCode).toEqual(401)
    })
    test('stay logged in after change', async () => {
      await agent.post('/signup').send({ username: 'user1', password: 'testpw' })
      await agent.post('/login').send({ username: 'user1', password: 'testpw' })
      await agent.put('/changePassword').send({ username: 'user1', password: 'testpw2' })
      const res = await agent.get('/auth')
      expect(res.statusCode).toEqual(200)
    })
  })
})
