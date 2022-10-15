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
  ARRAYS_AND_HASHING = 0,
}
