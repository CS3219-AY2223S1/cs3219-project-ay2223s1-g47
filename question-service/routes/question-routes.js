import express from "express";
import questionController from "../controller/question-controller.js";

const router = express.Router()

router.post("/difficulty/:difficulty", questionController.get_one_by_difficulty);
// router.get("/difficulty/:difficulty", questionController.get_by_difficulty);
// router.get("/id/:id", questionController.get_by_id);

export default router;
