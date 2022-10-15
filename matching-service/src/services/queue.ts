import amqp, { ConsumeMessage } from "amqplib";
import axios from "axios";
import { Types } from "mongoose";
import { TPendingMatch } from "../types/TPendingMatch";
import { getSocket, onMatchSuccess } from "./socket";

export const QUEUES = ["easy", "medium", "hard"];
export const WAITERS: (TPendingMatch | null)[] = QUEUES.map((queue) => null);

export const initQueues = async () => {
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const consumerChannel = await connection.createChannel();
    const producerChannel = await connection.createChannel();

    for (const queue of QUEUES) {
        consumerChannel.assertQueue(queue, {
            durable: false
        });
        consumerChannel.consume(queue, handleMessage);
        producerChannel.assertQueue(queue, {
            durable: false
        });
    }

    return producerChannel;
}

const handleMessage = (msg: ConsumeMessage | null) => {
    if (!msg) return;
    const pendingMatch: TPendingMatch = JSON.parse(msg.content.toString());
    const { difficulty, userId, socketId } = pendingMatch;
    const pendingSocket = getSocket(socketId);
    const waiting = WAITERS[difficulty];
    const waitingSocket = waiting && getSocket(waiting.socketId);

    console.log(JSON.parse(msg.content.toString()));
    console.log("Waiting socket", waiting?.socketId);
    console.log(" [x] Received %s", pendingMatch.toString());

    if (!waiting || !waitingSocket || !waitingSocket.connected
            || waiting.userId == pendingMatch.userId) {
        WAITERS[difficulty] = pendingMatch;
    }
    else {
        // const room = createRoom(userId, waiting.userId);
        const room = { roomId: "roomId" };
        onMatchSuccess(pendingSocket, waitingSocket, room);
        WAITERS[difficulty] = null;
    }
}

// Send data to collab service
const createRoom = async (userId1: Types.ObjectId, userId2: Types.ObjectId) => {
    const collabUri = "localhost:3000";
    const res = await axios.post(collabUri, {
        userIds: [userId1, userId2],
    });
    if (res.status == 200) {
        return res.data;
    }
    return;
}