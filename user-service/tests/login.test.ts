import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => {await db.close() })


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