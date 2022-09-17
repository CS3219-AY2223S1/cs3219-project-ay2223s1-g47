import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    qid: Number,
    title: String,
    description: String,
    solution: String,
    difficulty: String,
    topic: String,
})

export default mongoose.model("Question", questionSchema)
