import request from 'supertest'
import app from '../src/index'
import db from '../tests_config/database'

const agent = request.agent(app)

beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => {await db.close() })

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
