export interface Room {
  roomId: string;
  createdAt: string;
  state: RoomState;
  numInRoom: number;
  question: Question;
  events: ChatRoomEvent[];
  videoRoomUrl: string;
}

export interface RoomState {
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

export enum ChatRoomEventType {
  USER_JOIN = 0,
  USER_LEFT = 1,
}

export interface ChatRoomEvent {
  eventType: ChatRoomEventType;
  message: string;
  userIds: string[];
}
