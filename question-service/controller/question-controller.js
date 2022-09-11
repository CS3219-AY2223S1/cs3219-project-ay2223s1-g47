import mongoose from "mongoose";
import Question from "../Question.js";
import 'dotenv/config'

mongoose.connect(process.env.DB_LOCAL_URI, () => {
    console.log("mongodb connected");
});

// Get one question by difficulty, and not in the question history 
const get_one_by_difficulty = (req, res) => {
    const difficulty = req.params.difficulty;
    const past_qns = req.body.questionIds;

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

// const get_by_difficulty = (req, res) => {
//     const difficulty = req.params.difficulty;

//     Question.where("difficulty")
//         .equals(difficulty)
//         .then((questions) => {
//             res.send(questions);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// const get_by_id = (req, res) => {
//   console.log("get_by_id " + req.params.id);
//   res.send("questions get by id");
// };

export default {
    get_one_by_difficulty,
    // get_by_difficulty,
    // get_by_id,
};
