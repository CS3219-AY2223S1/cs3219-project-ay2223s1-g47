import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => {await db.close() })

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