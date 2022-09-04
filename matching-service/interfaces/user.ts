import mongoose from "mongoose";

export interface User extends mongoose.Document {
    name: String;
}