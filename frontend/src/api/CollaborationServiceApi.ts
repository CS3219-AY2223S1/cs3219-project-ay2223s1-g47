import axios, { AxiosError } from "axios";
import { COLLABORATION_SERVICE_GET_ROOM_URL } from "../constants";
import { ChatMessage } from "../interfaces/collaboration/Room";

export const apiGetRoom = async (roomId: string) => {
  const response = axios
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
    }) as Promise<{
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
}

export interface QuestionInResponse {
  qid?: string;
  title?: string;
  description?: string;
  topic?: number;
  difficulty?: number;
}

interface RoomStateInResponse {
  chat_history?: Array<ChatMessage>;
  code?: string;
}
