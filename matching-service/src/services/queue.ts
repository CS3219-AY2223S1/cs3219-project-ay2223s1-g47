import amqp, { Channel, ConsumeMessage } from "amqplib";
import { TPendingMatch } from "../types/TPendingMatch";
import { createRoom } from "./room";
import { getSocket, onMatchSuccess } from "./socket";

/**
 * Specify 1 queue for each difficulty level.
*/
const QUEUES = ["easy", "medium", "hard"];
/**
 * For each queue, at most 1 match will be pending at a time (waiter).
 * Initialize all waiters to null.
*/
const WAITERS: (TPendingMatch | null)[] = QUEUES.map(() => null);

/**
 * Connect to rabbitMq. Initialize channels and queues.
 * @returns producerChannel: Channel
 */
export const initQueues = async () => {
    const rabbitMqUri = process.env.RABBITMQ_URI || "amqp://localhost:5672";
    const connection = await amqp.connect(rabbitMqUri);
    const consumerChannel = await connection.createChannel();
    const producerChannel = await connection.createChannel();

    // Create queue for each difficulty level.
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

/**
 * Enqueue message (pending match) to queue with corresponding difficulty.
 */
export const sendMessage = (
    channel: Channel,
    pendingMatch: TPendingMatch
) => {
    channel.sendToQueue(
        QUEUES[pendingMatch.difficulty],
        Buffer.from(JSON.stringify(pendingMatch))
    );
}

/**
 * Dequeue/consume message.
 * Check if there is waiting pending match.
 * If no waiting match, current match waits for next match.
 * Otherwise, create room with waiting match and current match. Send room id to client.
 * @param msg
 */
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

    if (!waiting
            || !waitingSocket
            || !waitingSocket.connected
            || waiting.userId == pendingMatch.userId
    ) {
        WAITERS[difficulty] = pendingMatch;
    } else {
        WAITERS[difficulty] = null;
        const roomId = await createRoom(userId, waiting.userId, difficulty);
        // Sends room id to frontend.
        onMatchSuccess(pendingSocket, waitingSocket, roomId);
    }
}
