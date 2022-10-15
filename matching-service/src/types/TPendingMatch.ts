import { SocketId } from "socket.io-adapter";

export type TPendingMatch = {
    userId: string;
    difficulty: number;
    socketId: SocketId;
}