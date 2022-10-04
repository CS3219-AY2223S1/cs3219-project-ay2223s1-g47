import { Types } from "mongoose"
import { SocketId } from "socket.io-adapter";

export type TPendingMatch = {
    userId: Types.ObjectId;
    difficulty: number;
    socketId: SocketId;
}