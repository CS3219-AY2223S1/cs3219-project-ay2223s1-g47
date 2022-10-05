import assert from 'assert'
import cors from 'cors'
import { createSecretKey } from 'crypto'
import * as dotenv from 'dotenv'
dotenv.config()
const { subtle } = require('crypto').webcrypto

// ======= assertions to check .env ========
assert(process.env.PW_SALT, 'PW_SALT not set in .env')
assert(process.env.ENV, 'ENV not set in .env')
assert(
  process.env.DB_LOCAL_URI || process.env.DB_CLOUD_URI,
  'db uri not set in .env'
)
assert(process.env.JWT_SECRET_KEY, 'JWT_SECRET_KEY not set in .env')

// =========== environment =================
export const ENV_IS_DEV = process.env.ENV == 'DEV'
export const ENV_IS_PROD = process.env.ENV == 'PROD'

// =========== CORS config =================
/**
 * White listed origins for CORS.
 *
 * See https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
 * for more information.
 */
export const CORS_OPTIONS: cors.CorsOptions = {
  credentials: true,
  origin: 'http://localhost:3000' // TODO: currently we allow all origins
}

// ============ app config =================
export const DEFAULT_PORT = 8000

// ======= login handler config ============
export const PW_SALT = process.env.PW_SALT || 10 // some default

// ============ db config ==================
// if dev, local. staging and prod we use cloud db
export const DB_URI =
  (ENV_IS_DEV ? process.env.DB_LOCAL_URI : process.env.DB_CLOUD_URI) ?? ''

export const DB_LOCAL_JSON_PATH =
  process.env.DB_LOCAL_JSON_PATH ?? './src/dev-data.json'

export const DB_TABLES = ['users']

// ========== JWT ==========================
export const JWT_EXPIRES_IN = '12h'
export const JWT_ISSUER = 'user-service'
// jwt secret key, which we hash into a key
export const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY ?? ''
)
