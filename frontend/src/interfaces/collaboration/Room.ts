export interface Room {
  roomId: string;
  createdAt: string;
  closedAt: string;
  isClosed: boolean;
  state: RoomState;
  numInRoom: number;
  question: Question;
}

export interface RoomState {
  chatHistory: Array<ChatMessage>;
  code: string;
}

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

export interface ChatMessage {
  message: string;
  id: string; // user id
  username: string;
  timestamp: string;
}
