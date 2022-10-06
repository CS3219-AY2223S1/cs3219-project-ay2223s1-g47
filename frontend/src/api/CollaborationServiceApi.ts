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

interface RoomApiResponseData {
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
  question_id?: string;
  question?: string;
  answer?: string;
  question_resource_uris?: Array<string>;
  answer_resource_uris?: Array<string>;
  created_at?: string;
  difficulty?: number;
}

interface RoomStateInResponse {
  chat_history?: Array<ChatMessage>;
  code?: string;
}
