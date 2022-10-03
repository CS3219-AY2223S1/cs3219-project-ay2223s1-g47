import amqp, { ConsumeMessage } from "amqplib";
import { Socket } from "socket.io";
import { io } from ".";
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
        consumerChannel.consume(queue, handleMessage);
        producerChannel.assertQueue(queue, {
            durable: false
        });
    }
    return producerChannel;
}

const handleMessage = (msg: ConsumeMessage | null) => {
    if (!msg) return;
    console.log(JSON.parse(msg.content.toString()));
    const pendingMatch: TPendingMatch = JSON.parse(msg.content.toString());
    const { difficulty} = pendingMatch;
    const waiting = WAITERS[difficulty];
    console.log("Waiting socket", waiting?.socketId);
    const waitingSocket = waiting && io.sockets.sockets.get(waiting.socketId);
    console.log(" [x] Received %s", pendingMatch.toString());

    if (!waiting || !waitingSocket || !waitingSocket.connected) {
        WAITERS[difficulty] = pendingMatch;
    }
    else {
        match(pendingMatch, waiting);
        onMatch(pendingMatch, waiting);
        WAITERS[difficulty] = null;
        console.log("match");
    }
}

const onMatch = (match1: TPendingMatch, match2: TPendingMatch) => {
    const socket1: Socket = io.sockets.sockets.get(match1.socketId);
    const socket2: Socket = io.sockets.sockets.get(match2.socketId);
    if (socket1) socket1.to(match1.socketId).emit("matchSuccess", match1);
    if (socket2) socket2.to(match2.socketId).emit("matchSuccess", match2);
    console.log("matchSuccess");
}

const match = (match1: TPendingMatch, match2: TPendingMatch) => {
    // Send data to collab service
}