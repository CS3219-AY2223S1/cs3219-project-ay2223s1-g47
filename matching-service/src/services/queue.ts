import amqp, { ConsumeMessage } from "amqplib";
import { TPendingMatch } from "../types/TPendingMatch";
import { getSocket, onMatchSuccess } from "./socket";

export const QUEUES = ["easy", "medium", "hard"];
export const WAITERS: (TPendingMatch | null)[] = QUEUES.map((queue) => null);

export const initQueues = async () => {
    const connection = await amqp.connect("amqp://localhost");
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
    const { difficulty } = pendingMatch;
    const waiting = WAITERS[difficulty];
    const waitingSocket = waiting && getSocket(waiting.socketId);

    console.log(JSON.parse(msg.content.toString()));
    console.log("Waiting socket", waiting?.socketId);
    console.log(" [x] Received %s", pendingMatch.toString());

    if (!waiting || !waitingSocket || !waitingSocket.connected) {
        WAITERS[difficulty] = pendingMatch;
    }
    else {
        createRoom(pendingMatch, waiting);
        onMatchSuccess(pendingMatch, waiting);
        WAITERS[difficulty] = null;
    }
}

const createRoom = (match1: TPendingMatch, match2: TPendingMatch) => {
    // Send data to collab service
}