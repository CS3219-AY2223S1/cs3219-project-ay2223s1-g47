import e from "express";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { SocketId } from "socket.io-adapter";
import { io } from "..";
import { TPendingMatch } from "../types/TPendingMatch";
import { checkValidators } from "../utils/validator";
import { initQueues, QUEUES } from "./queue";

const MATCH_TIMEOUT = 60000; // Pending match duration

// const cullDuplicateConnection = async ({ socket }: { socket: Socket }) => {
//     const latestSocketId = "latestSocketId";
//     const latestSocket = getSocket(latestSocketId);
//     if (latestSocket && latestSocketId != socket.id && latestSocket.connected) {
//         socket.disconnect();
//     }
//     else {
//         // apicall to user service that updates latest socket id
//     }
// }

const cullDuplicateConnection = async ({ socket }: { socket: Socket }) => {
    const sockets: Socket[] = Array.from(io.sockets.sockets.values());
    const existing = sockets.find((s: Socket) => {
        return s.handshake.query.userId
                && s.handshake.query.userId !== socket.handshake.query.userId
                && s.connected;
    });
    if (existing) {
        console.log("existing socket: ", existing.id);
        socket.disconnect();
    }
}

const connectionValidators = [
    cullDuplicateConnection,
];

export const listenForMatches = async () => {
    const channel = await initQueues();

    io.on("connection", (socket: Socket) => {
        checkValidators({ socket }, connectionValidators);
        console.log("a user connected: ");

        socket.on("match", async (
            args: { difficulty: number, userId: Types.ObjectId }
        ) => {
            const { difficulty } = args;
            try {
                console.log("match");
                const data: TPendingMatch = {
                    socketId: socket.id,
                    ...args,
                }
                channel.sendToQueue(
                    QUEUES[difficulty],
                    Buffer.from(JSON.stringify(data))
                );
            } catch (err) {
                console.log(err);
            }
        });
    
        socket.on("matchSuccess", async (pendingMatch) => {
            console.log("room created: ", pendingMatch);
        });
    
        socket.on("disconnect", async () => {
            console.log("user disconnected");
        });

        socket.timeout(MATCH_TIMEOUT).emit("timeout", (err: any) => {
            if (err) {
              // the other side did not acknowledge the event in the given delay
            }
            socket.disconnect();
        });
    });
}

export const getSocket = (socketId: SocketId) => {
    return io.sockets.sockets.get(socketId);
}

export const onMatchSuccess = (match1: TPendingMatch, match2: TPendingMatch) => {
    const socket1: Socket = io.sockets.sockets.get(match1.socketId);
    const socket2: Socket = io.sockets.sockets.get(match2.socketId);
    if (socket1) socket1.to(match1.socketId).emit("matchSuccess", match1);
    if (socket2) socket2.to(match2.socketId).emit("matchSuccess", match2);
    console.log("matchSuccess");
}