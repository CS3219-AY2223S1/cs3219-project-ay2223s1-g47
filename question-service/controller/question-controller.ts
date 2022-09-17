import mongoose from "mongoose";
import Question from "../Question.js";
import 'dotenv/config'

mongoose.connect(process.env.DB_LOCAL_URI, () => {
    console.log("mongodb connected");
});

// Get one question by difficulty, and not in the question history 
const get_one_by_difficulty = (req, res) => {
    const difficulty : string = req.params.difficulty;
    const past_qns : string[] = req.body.questionIds;

    Question.findOne()
        .where("difficulty")
        .equals(difficulty)
        .where("_id")
        .nin(past_qns)
        .then((question) => {
            res.send(question);
        })
        .catch((err) => {
            console.log(err);
        });
};

export default {
    get_one_by_difficulty,
};
