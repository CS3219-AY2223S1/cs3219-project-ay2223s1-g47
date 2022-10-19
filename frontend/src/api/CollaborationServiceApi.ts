import axios, { AxiosError } from "axios";
import { COLLABORATION_SERVICE_GET_ROOM_URL } from "../constants";
import { ChatRoomEventType, Question } from "../interfaces/collaboration/Room";

export const apiGetRoom = async (roomId: string) => {
  // 1. post request
  const response = (await axios
    .get(COLLABORATION_SERVICE_GET_ROOM_URL + "/" + roomId, {
      withCredentials: true,
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    })) as Promise<{
    status: number;
    detail: { message?: string; detail?: any };
    data: RoomApiResponseData;
  }>;

  return response;
};

export const apiGetRoomHistory = async () => {
  const response = axios
    .get(COLLABORATION_SERVICE_GET_ROOM_URL + "/crud/get_room_history", {
      withCredentials: true,
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    }) as Promise<{
    status: number;
    detail: { message?: string; detail?: any };
    data: RoomApiResponseData[];
  }>;
  return response;
};

export interface RoomApiResponseData {
  message?: string; // error message

  room_id?: string;
  created_at?: string;
  closed_at?: string;
  is_closed?: boolean;
  state?: RoomStateInResponse;
  num_in_room?: number;
  question?: QuestionInResponse;
  events?: ChatRoomEventInResponse[];
}

export interface QuestionInResponse {
  qid?: string;
  title?: string;
  description?: string;
  topic?: number;
  difficulty?: number;
}

export interface ChatRoomEventInResponse {
  event_type: ChatRoomEventType;
  message: string;
  user_ids: string[];
}

interface RoomStateInResponse {
  code?: string;
}

export const convertRoomApiResponseToRoom = (response: RoomApiResponseData) => {
  return {
    roomId: response.room_id ?? "",
    createdAt: response.created_at ?? "",
    state: {
      code: response.state?.code ?? "",
    },
    numInRoom: response.num_in_room ?? 0,
    question: {
      qid: response.question?.qid ?? "",
      title: response.question?.title ?? "",
      description: response.question?.description ?? "",
      difficulty: response.question?.difficulty ?? 0,
      topic: response.question?.topic ?? 0,
    },
    events: !!response.events
      ? response.events.map((event) => {
          return {
            eventType: event.event_type ?? 0,
            message: event.message ?? "",
            userIds: event.user_ids ?? [],
          };
        })
      : [],
  };
};
