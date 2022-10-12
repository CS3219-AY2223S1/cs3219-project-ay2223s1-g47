import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { CORS_OPTIONS, DEFAULT_PORT } from './constants'
import {
  handleCreateUser,
  login,
  auth,
  auth_server,
  logout,
  changeUsername,
  changePassword,
  get_jwt,
} from "./controller/user-controller";
const CookieParser = require("cookie-parser");

// ======= initialize stuff with require ========
require('./db/db')

// ============== start the app =================
const app: Express = express()
const PORT = process.env.PORT || DEFAULT_PORT

// ============== middleware config =============
// see https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
// and https://masteringjs.io/tutorials/express/express-json for more details
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // parses incoming json and puts parsed data in req.body. See
app.use(cors(CORS_OPTIONS)) // use and set cors config
app.use(CookieParser()) // for parsing cookies

// =================== routing ==================

/**
 * Basic hello world ping.
 */
app.get('/', (request: Request, response: Response) =>
  response.send('Hello World from user-service')
)

/**
 * Endpoint to create a new user.
 */
app.post('/signup', handleCreateUser)

/**
 * Endpoint to login.
 */
app.post('/login', login)

/**
 * Endpoint to login.
 */
app.put('/changePassword', changePassword)

/**
 * Endpoint to login.
 */
app.put('/changeUsername', changeUsername)

/**
 * Endpoint to logout.
 */
app.post('/logout', logout)

/**
 * Endpoint to ping for authentication. Assumes that the user has cookies
 * to use for authentication.
 */
app.get('/auth', auth)


/**
 * Endpoint to ping to verify a jwt is valid. Intended to be used by other services.
 */
app.post("/auth/jwt", auth_server);

/**
 * Endpoint to ping to get a new jwt. Expected to already have a httponly jwt. This is intended for
 * services that require explicit jwt's, like socket connections.
 */
app.get("/get_jwt", get_jwt);


// listen only if launched directly
if (require.main === module) {
  app.listen(PORT, () => console.log('user-service listening on port ' + PORT))
}
export default app