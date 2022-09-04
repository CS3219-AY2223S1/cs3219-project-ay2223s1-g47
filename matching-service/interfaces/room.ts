import mongoose from "mongoose";

export interface Room extends mongoose.Document {
    userIds: String[];
}