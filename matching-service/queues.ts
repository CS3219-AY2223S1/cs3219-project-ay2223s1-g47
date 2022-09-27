import amqp, { ConsumeMessage } from "amqplib";
import { TPendingMatch } from "./types";

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
        consumerChannel.consume(queue, (msg) => handleMessage);
        producerChannel.assertQueue(queue, {
            durable: false
        });
    }
    return producerChannel;
}

const handleMessage = (msg: ConsumeMessage) => {
    const pendingMatch: TPendingMatch = JSON.parse(msg.content.toString());
    const { difficulty, socket } = pendingMatch;
    const waiting = WAITERS[difficulty];
    console.log(" [x] Received %s", pendingMatch.toString());

    if (!waiting || !waiting.socket.connected) {
        WAITERS[difficulty] = pendingMatch;
    }
    else {
        match(pendingMatch, waiting as TPendingMatch);
        socket.to(socket.id).emit("matchSuccess", pendingMatch);
        socket.to(waiting.socket.id).emit("matchSuccess", waiting);
        WAITERS[difficulty] = null;
        console.log("match");
    }
}

const match = (msg1: TPendingMatch, msg2: TPendingMatch) => {
    // Send data to collab service
}