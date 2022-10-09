import { Request, Response } from "express";
import questionServices from "./services/question-services";
import {
  createNoContentResponse,
  createNotFoundResponse,
  createOkResponse,
} from "./services/response-services";

/**
 * Get one question by difficulty randomly.
 */
const get_random_question_by_difficulty = async (
  request: Request,
  response: Response
) => {
  // 1. read params
  const difficulty: number = request.query.difficulty as unknown as number;
  console.log(difficulty);

  // 2. query db
  const question = await questionServices.get_question_by_difficulty(
    difficulty
  );

  // 3. return response
  if (!!question) {
    return createOkResponse(response, question);
  }
  return createNoContentResponse(response);
};

/**
 * Gets question by id.
 */
const get_question_by_qid = async (request: Request, response: Response) => {
  // read params
  const qid: string = request.query.qid as unknown as string;

  // query db
  const question = await questionServices.get_question_by_qid(qid);

  // return response
  if (!!question) {
    return createOkResponse(response, question);
  }
  return createNotFoundResponse(response);
};

export default {
  get_random_question_by_difficulty: get_random_question_by_difficulty,
  get_question_by_qid: get_question_by_qid,
};
