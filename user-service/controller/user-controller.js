import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormLogin as _login } from '../model/user-orm.js'
import { ormDeleteUser as _delete } from '../model/user-orm.js'
import { ormChangePassword as _changePassword } from '../model/user-orm.js'
import { SignJWT, jwtVerify, generateKeyPair, } from 'jose'
import {unauthorized,databaseError} from './response.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

//TODO: store keys in .env?
const { publicKey, privateKey } = await generateKeyPair('ES256')
const salt = process.env.PW_SALT

async function checkJWT(req) {
  //handles checking for expiry

  if (!req.headers.cookie) { return false; }
  let cookies = req.headers.cookie.split("; ").filter(x => x.startsWith("JWT="))
  if (cookies.length != 1) { return false }
  let jwt_received = cookies[0].split("=")[1]
  try {
    const { payload, protectedHeader } = await jwtVerify(jwt_received, publicKey, { issuer: 'user-service'})
    return payload
  } catch (err) {
    console.log("invalid jwt")
    return false
  }
}

export async function createUser(req, res) {
  try {
    let { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and/or Password are missing!' })
    }
    password = bcrypt.hashSync(password, salt);

    const resp = await _createUser(username, password);
    if (resp.err) {
      return res.status(400).json({ message: 'Could not create a new user!' })
    }
    if (resp === false) {
      return res.status(400).json({ message: 'Could not create a new user!' })
    }
    console.log(`Created new user ${username} successfully!`)
    return res.status(201).json({ message: `Created new user ${username} successfully!` })

  } catch (err) {
    console.log(err);
    return databaseError(res)
  }
}

export async function login(req, res) {
  try {
    //password salt and hash here
    let { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and/or Password are missing!' });
    }
    password = bcrypt.hashSync(password, salt);

    const resp = await _login(username, password);
    if (resp.err) {
      return res.status(400).json({ message: 'Could not login!' });
    }

    if (resp === false) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    let jwt_cookie = await new SignJWT({ 'username': username })
      .setProtectedHeader({ alg: 'ES256' })
      .setIssuedAt()
      .setIssuer('user-service')
      .setExpirationTime('2h')
      .sign(privateKey)
    res.cookie('JWT', jwt_cookie, { httpOnly: true, secure: process.env.ENV == "PROD" });
    res.cookie('cookie2', 'value')
    return res.status(201).json({ message: `Successful login as ${username} !` });

  } catch (err) {
    console.log(err)
    return databaseError(res)
  }
}

export async function auth(req,res) {
  if( await checkJWT(req)){
    return res.status(200).json({message:'Logged in with valid JWT'})
  } else {
    return res.status(401).json({message:'Not logged in!'})
  }
}

export async function deleteUser(req, res) {
  if (! await checkJWT(req)) { return unauthorized(res) }
  try {
    //password salt and hash here
    let { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username and/or Password are missing!' });
    }
    if (username != (await checkJWT(req)).username){
      return res.status(401).json({ message: 'Cannot delete a different account'});
    }

    const resp = await _delete(username);

    if (resp.err) {
      return res.status(400).json({ message: 'Could not delete!' });
    }

    if (resp === false) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }
    return res.status(201).json({ message: `Successfully deleted ${username} !` });

  } catch (err) {
    console.log(err)
    return databaseError(res)
  }
}

export async function changePassword(req, res) {
  if (! await checkJWT(req)) { return unauthorized(res) }
  try {
    let { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and/or Password are missing!' });
    }
    password = bcrypt.hashSync(password, salt);

    if (username != (await checkJWT(req)).username){
      return res.status(401).json({ message: 'Cannot modify a different account'});
    }
    const resp = await _changePassword(username,password);

    if (resp.err) {
      return res.status(400).json({ message: 'Could not change password!' });
    }

    if (resp === false) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }
    return res.status(201).json({ message: `Successfully changed password of ${username} !` });

  } catch (err) {
    console.log(err)
    return databaseError(res)
  }

}