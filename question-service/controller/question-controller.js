"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Question_js_1 = __importDefault(require("../Question.js"));
require("dotenv/config");
mongoose_1.default.connect(process.env.DB_LOCAL_URI, () => {
    console.log("mongodb connected");
});
// Get one question by difficulty, and not in the question history 
const get_one_by_difficulty = (req, res) => {
    const difficulty = req.params.difficulty;
    const past_qns = req.body.questionIds;
    if (past_qns == null) {
        res.status(404).send({ "message": "Wrong format for POST request body" });
    }
    Question_js_1.default.findOne()
        .where("difficulty")
        .equals(difficulty)
        .where("_id")
        .nin(past_qns)
        .then((question) => {
        if (question == null) {
            res.status(404).send({ "message": "No questions found" });
        }
        return res.send(question);
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.default = {
    get_one_by_difficulty,
};
