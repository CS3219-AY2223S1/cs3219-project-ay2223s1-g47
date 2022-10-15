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
