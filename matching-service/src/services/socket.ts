import axios from "axios";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { SocketId } from "socket.io-adapter";
import { io } from "..";
import { TPendingMatch } from "../types/TPendingMatch";
import { checkValidators } from "../utils/validator";
import { initQueues, QUEUES } from "./queue";

const MATCH_TIMEOUT = 60000; // Pending match duration

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

const validateUser = async ({ socket }: { socket: Socket }) => {
    const userServiceUri = "localhost:5000";
    const headers = socket.handshake.headers;
    const res = await axios.post(userServiceUri, headers);
    if (res.status == 200 && res.data) {
        const currentUserId = res.data;
        if (currentUserId != socket.handshake.query.userId) {
            throw new Error("wrong user!");
        }
    }
    else {
        // throw new Error("user does not exist");
    }
}

const connectionValidators = [
    cullDuplicateConnection,
    // validateUser,
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
    
        socket.on("matchSuccess", async (room) => {
            console.log("room created: ", room);
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

export const onMatchSuccess = (socket1: Socket, socket2: Socket, room: any) => {
    if (socket1 && socket2) {
        socket1.to(socket1.id).emit("matchSuccess", room);
        socket2.to(socket2.id).emit("matchSuccess", room);
    }
    console.log("matchSuccess");
}