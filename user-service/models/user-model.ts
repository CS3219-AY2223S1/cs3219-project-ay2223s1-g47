import mongoose, { Schema } from "mongoose";

/**
 * This schema defines the user we will save in db.
 */
const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UserModel", UserModelSchema);
