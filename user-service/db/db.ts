import UserModel from "../models/user-model";

import mongoose, { ConnectOptions } from "mongoose";
import { DB_URI } from "../constants";
import { LoginDetails } from "../interfaces/login-details";
import { User } from "../interfaces/user";

// =================== database ==================
// connect to db
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
