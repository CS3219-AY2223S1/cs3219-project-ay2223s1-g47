import express from "express";
import questionController from "../controller/question-controller.js";

const router = express.Router()

router.post("/difficulty/:difficulty", questionController.get_one_by_difficulty);

export default router;
