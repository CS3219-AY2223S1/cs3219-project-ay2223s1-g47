import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormLogin as _login } from '../model/user-orm.js'
import { SignJWT, jwtVerify, generateKeyPair, } from 'jose'

import bcrypt from 'bcrypt';
import 'dotenv/config'

//TODO: store keys in .env?
const { publicKey, privateKey } = await generateKeyPair('ES256')
const salt = process.env.PW_SALT

export async function createUser(req, res) {
    try {
        let { username, password } = req.body;
        password = bcrypt.hashSync(password, salt);
        if (!(username && password)) {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }        
        const resp = await _createUser(username, password);
        if (resp.err) {
            return res.status(400).json({ message: 'Could not create a new user!' });
        } 
        if (resp === false) {
            return res.status(400).json({ message: 'Could not create a new user!' });
        } 
        console.log(`Created new user ${username} successfully!`)
        return res.status(201).json({ message: `Created new user ${username} successfully!` });
        
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}



async function checkJWT(req){
    //handles checking for expiry

    if(!req.headers.cookie){return false;}
    let cookies = req.headers.cookie.split("; ").filter(x=>x.startsWith("JWT="))
    if (cookies.length != 1){return{}}

    let jwt_received = cookies[0].split("=")[1]
    try{
        let { payload, protectedHeader } = await jwtVerify(jwt_received, publicKey, {
            issuer: 'user-service',
        })
        return true
    } catch(err){
        return false
    }
}


export async function login(req, res) {

    if (await checkJWT(req)){
        //logged in with valid JWT
        return res.status(201).json({ message: `already logged in` });
    }
    
    try {
        //password salt and hash here
        let { username, password } = req.body;
        password = bcrypt.hashSync(password, salt);

        if (!(username && password)) {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }

        const resp = await _login(username, password);
    
        if (resp.err) {
            return res.status(400).json({ message: 'Could not login!' });
        } 

        if (resp === false) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        let jwt_cookie = await new SignJWT({ username: username })
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
        return res.status(500).json({ message: 'Database failure when logging in!' })
    }
}

export async function deleteUser(req,res){}
export async function changePassword(req,res){}