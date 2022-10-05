import mongoose from "mongoose";
import Question from "../Question.js";
import 'dotenv/config'

mongoose
.connect(process.env.DB_DOCKER_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

// Get one question by difficulty, and not in the question history 
const get_one_by_difficulty = (req: any, res: any) => {
    const difficulty : string = req.params.difficulty;
    const past_qns : string[] = req.body.questionIds;

    if (past_qns == null) {
        res.status(404).send({"message" : "Wrong format for POST request body"})
    }

    Question.findOne()
        .where("difficulty")
        .equals(difficulty)
        .where("_id")
        .nin(past_qns)
        .then((question) => {
            if (question == null) {
                return res.status(404).send({"message" : "No questions found"})
            }
            return res.send(question);
        })
        .catch((err) => {
            console.log(err);
        });
};

export default {
    get_one_by_difficulty,
};
