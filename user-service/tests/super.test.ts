import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => {await db.close()})

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
