import UserModel from './user-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * 
 * @param {*} params {username:string, password:string} username and password for new user
 * @returns new UserModel if valid
 * @throws Error if username already exists in database
 */
export async function createUser(params) {
  // check for existing user with same username
  if (await UserModel.exists({username:params.username})){throw new Error("Already Exists")}
  return new UserModel(params);
}

/**
 * 
 * @param {*} params {username:string, password:string} username and password for existing user
 * @returns true if matches existing user
 */
export async function login (params) { 
  // params is user,password
  return await UserModel.exists(params);
  
  // check validity of arguments
  // generate secret 
  // return 
}