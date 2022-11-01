/**
 * Question object.
 * TODO: provide example inputs, test cases, and expected outputs
 */
export interface Question {
  qid: string;
  title: string; // question title in markdown
  description: string; // description of the question in markdown.
  difficulty: QuestionDifficulty;
  topic: QuestionTopic;
}

export enum QuestionDifficulty {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
}

export enum QuestionTopic {
  ARRAY = 0,
  STRING = 1,
  SORTING = 2,
  TREE = 3,
  HASH_TABLE = 4,
  DYNAMIC_PROGRAMMING = 5,
}
