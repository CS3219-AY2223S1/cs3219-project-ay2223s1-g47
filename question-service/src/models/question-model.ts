import mongoose from "mongoose";

const QuestionModelSchema = new mongoose.Schema(
  {
    qid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
      index: true,
    },
    topic: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    collection: "questions",
  }
);

export default mongoose.model("QuestionModel", QuestionModelSchema);
