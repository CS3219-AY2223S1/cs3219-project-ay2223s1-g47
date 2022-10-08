import { User } from "../users/User";

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
  questionId: string;
  question: string;
  answer: string;
  questionResourceUris: Array<string>;
  answerResourceUris: Array<string>;
  createdAt: string;
  difficulty: number;
}

export interface ChatMessage {
  message: string;
  id: string; // user id
  username: string;
  timestamp: string;
}
