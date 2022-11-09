import { Question, QuestionDifficulty } from "../../interfaces/question";
import QuestionModel from "../../models/question-model";

/**
 * Wrapper method around the db. Gets a random question by difficulty.
 */
const get_question_by_difficulty = async (difficulty: QuestionDifficulty) => {
  // using mongoose wrapper, query
  

  const count = await QuestionModel.count({"difficulty":difficulty});
  const  random = Math.floor(Math.random() * count);
  
  
  const questionModel = await QuestionModel
  .findOne() // find one picks randomly. see https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose
  .skip(random)
  .where("difficulty")
    .equals(difficulty)
    .catch((err) => {
      console.log(err);
    });

  // convert to interface
  // if null, return null
  if (!!questionModel) {
    const questionInterface: Question = {
      qid: questionModel.qid,
      title: questionModel.title,
      description: questionModel.description,
      difficulty: questionModel.difficulty,
      topic: questionModel.topic,
    };
    return questionInterface;
  }
  return null;
};

/**
 * Wrapper method around the db. Gets a question by qid.
 */
const get_question_by_qid = async (qid: string) => {
  // using mongoose wrapper, query
  const questionModel = await QuestionModel.findOne() // find one picks randomly. see https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose
    .where("qid")
    .equals(qid)
    .catch((err) => {
      console.log(err);
    });

  // convert to interface
  // if null, return null
  if (!!questionModel) {
    const questionInterface: Question = {
      qid: questionModel.qid,
      title: questionModel.title,
      description: questionModel.description,
      difficulty: questionModel.difficulty,
      topic: questionModel.topic,
    };
    return questionInterface;
  }
  return null;
};

export default {
  get_question_by_difficulty: get_question_by_difficulty,
  get_question_by_qid: get_question_by_qid,
};
