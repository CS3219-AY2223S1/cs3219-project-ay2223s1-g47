import mongoose from "mongoose";

export interface Room extends mongoose.Document {
    userIds: mongoose.Types.ObjectId[];
}