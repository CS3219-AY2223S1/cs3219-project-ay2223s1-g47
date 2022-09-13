import UserModel from './user-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * 
 * @param {*} params {username:string, password:string} username and password for new user
 * @returns new UserModel if valid
 */
export async function createUser(params) {
  return new UserModel(params);
}

/**
 * 
 * @param {*} params {username:string, password:string} username and password for existing user
 * @returns true if matches existing user
 */
export async function login(params) {
  // params is user,password
  return Boolean(await UserModel.exists(params));
}

export async function deleteUser(params) {
  return UserModel.deleteOne({username:params.username})
}

export async function changePassword(params) {
  return await UserModel.findOneAndUpdate( {'username' : params.username} , params)
}

export async function existsUser(params) {
  // _id if exists, null if false --> true if exists, false if not
  return Boolean(await UserModel.exists({ username: params.username }))
}