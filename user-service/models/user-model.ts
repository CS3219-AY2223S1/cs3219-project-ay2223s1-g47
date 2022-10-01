import mongoose, { Schema } from "mongoose";

/**
 * This schema defines the user we will save in db.
 */
const UserModelSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
  }
);

export default mongoose.model("UserModel", UserModelSchema);
