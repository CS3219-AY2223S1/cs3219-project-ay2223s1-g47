import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import { initQueues, QUEUES } from './queues';
import { TPendingMatch } from './types';
import { Types } from 'mongoose';

const frontendUri = process.env.FRONTEND_URI || "http://localhost:3000";

const app = express();
const httpServer = createServer(app);
export const io = require("socket.io")(httpServer, {
    cors: {
      origin: frontendUri,
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use

const FALLBACK_PORT = 8001; // localhost port
const MATCH_TIMEOUT = 60000; // Pending match duration

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const listenForMatches = async () => {
    const channel = await initQueues();

    io.on("connection", (socket: Socket) => {
        console.log("a user connected");
        socket.on("match", async (
            args: { difficulty: number, userId: Types.ObjectId }
        ) => {
            const { difficulty } = args;
            try {
                console.log("match");
                const data: TPendingMatch = {
                    createdAt: new Date(),
                    socketId: socket.id,
                    ...args,
                }
                channel.sendToQueue(QUEUES[difficulty], Buffer.from(JSON.stringify(data)));
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
    });
}

listenForMatches();

httpServer.listen(process.env.PORT || FALLBACK_PORT);
