import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, login, auth, deleteUser, changePassword,logout } from './controller/user-controller.js';

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/new', createUser)
router.post('/login', login)
router.post('/logout', logout)
router.get('/auth', auth)
router.post('/delete', deleteUser)
router.post('/changePassword', changePassword)

app.use('/api/user', router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('user-service listening on port 8000'));