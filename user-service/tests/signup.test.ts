import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => {await db.close()})

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