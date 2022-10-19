import express from "express";
import questionController from "../controller/question-controller";

const router = express.Router();

/**
 * POST endpoint to get a question by difficulty. We put as a POST endpoint
 * as we expect to pass data to it down the line. Specifically, a list of
 * questions NOT to include.
 */
router.post(
  "/difficulty",
  questionController.get_random_question_by_difficulty
);

router.get("/qid", questionController.get_question_by_qid);

export default router;
