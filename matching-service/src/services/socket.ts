import { Channel } from "amqplib";
import axios from "axios";
import { Socket } from "socket.io";
import { SocketId } from "socket.io-adapter";
import { io } from "..";
import { TPendingMatch } from "../types/TPendingMatch";
import { checkValidators } from "../utils/validator";
import { initQueues, sendMessage } from "./queue";

const MATCH_TIMEOUT = 60000; // Pending match duration

/**
 * Disconnect socket if user has another connected socket.
 */
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

/**
 * 
 * Authenticate user.
 * Throw error if socker user does not match user specified by jwt.
 */
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
    // Set up message channels and queues.
    const channel = await initQueues();

    io.on("connection", async (socket: Socket) => {
        // Validate socketio connection. Disconnect or throw error if invalid.
        await checkValidators({ socket }, connectionValidators);
        console.log("a user connected, socketid: ", socket.id);

        // Socketio event listeners.
        socket.on("match", (
            args: { difficulty: number, userId: string }
        ) => onMatch(channel, socket, args));
    
        socket.on("disconnect", () => onDisconnect);

        socket.timeout(MATCH_TIMEOUT).emit("timeout", () => onTimeout(socket));
    });
}

export const getSocket = (socketId: SocketId) => {
    return io.sockets.sockets.get(socketId);
}

/**
 * Handle successful matching.
 * Send matchSuccess event to matched sockets along with shared room id.
 * @param socket1 
 * @param socket2 
 * @param roomId 
 */
export const onMatchSuccess = (socket1: Socket, socket2: Socket, roomId: string) => {
    if (socket1 && socket2) {
        socket1.emit("matchSuccess", roomId);
        socket2.emit("matchSuccess", roomId);
    }
    console.log("matchSuccess");
}

/**
 * Handle match event. Create pending match and send to queue.
 * @param channel 
 * @param socket 
 * @param args 
 */
const onMatch = async (
    channel: Channel,
    socket: Socket,
    args: { difficulty: number, userId: string }
) => {
    try {
        console.log("match");
        const data: TPendingMatch = {
            socketId: socket.id,
            ...args,
        }
        sendMessage(channel, data);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Handle timeout event. Disconnect socket if no match found in time.
 * @param socket 
 */
const onTimeout = (socket: Socket) => {
    socket.disconnect();
}

const onDisconnect = async () => {
    console.log("user disconnected");
}