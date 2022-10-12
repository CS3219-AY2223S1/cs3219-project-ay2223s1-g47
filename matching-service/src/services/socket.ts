import axios from "axios";
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
                && s.handshake.query.userId === socket.handshake.query.userId
                && s.id !== socket.id
                && s.connected;
    });
    if (existing) {
        console.log("existing socket: %s %s", existing.id, socket.id);
        existing.disconnect();
    }
}

const validateUser = async ({ socket }: { socket: Socket }) => {
    const userServiceUri = "http://localhost:8000/auth/jwt";
    const socketJwt = socket.handshake.query.socketJwt;
    const res = await axios.post(userServiceUri, { jwt: socketJwt });
    if (res.status == 200 && res.data) {
        const user = res.data;
        if (user.id != socket.handshake.query.userId) {
            throw new Error("wrong user!");
        }
        console.log("user: ", user);
    }
    else {
        throw new Error("user does not exist");
    }
}

const connectionValidators = [
    cullDuplicateConnection,
    // validateUser,
];

export const listenForMatches = async () => {
    const channel = await initQueues();

    io.on("connection", async (socket: Socket) => {
        await checkValidators({ socket }, connectionValidators);
        console.log("a user connected, socketid: ", socket.id);

        socket.on("match", async (
            args: { difficulty: number, userId: string }
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
        socket1.emit("matchSuccess", room);
        socket2.emit("matchSuccess", room);
    }
    console.log("matchSuccess");
}