import amqp, { ConsumeMessage } from "amqplib";
import axios from "axios";
import { TPendingMatch } from "../types/TPendingMatch";
import { getSocket, onMatchSuccess } from "./socket";

export const QUEUES = ["easy", "medium", "hard"];
export const WAITERS: (TPendingMatch | null)[] = QUEUES.map((queue) => null);

export const initQueues = async () => {
    const rabbitMqUri = process.env.RABBITMQ_URI || "amqp://localhost:5672";
    const connection = await amqp.connect(rabbitMqUri);
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

const handleMessage = async (msg: ConsumeMessage | null) => {
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
        const roomId = await createRoom(userId, waiting.userId, difficulty);
        onMatchSuccess(pendingSocket, waitingSocket, roomId);
        WAITERS[difficulty] = null;
    }
}

// Send data to collab service
const createRoom = async (userId1: string, userId2: string, difficulty: number) => {
    const collabUri = process.env.COLLABORATION_SERVICE_URI
            || "http://localhost:8003";
    const res = await axios.post(collabUri + "/crud/create", {
        user1_id: userId1,
        user2_id: userId2,
        difficulty,
    });
    if (res.status == 200) {
        return res.data;
    }
    return;
}