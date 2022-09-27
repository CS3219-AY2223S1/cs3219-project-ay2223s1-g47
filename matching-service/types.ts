import { Types } from "mongoose"
import { Socket } from "socket.io";

export type TPendingMatch = {
    userId: Types.ObjectId;
    difficulty: number;
    socket: Socket;
}