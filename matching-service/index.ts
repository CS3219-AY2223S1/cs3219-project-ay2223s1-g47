import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createPendingMatch, deletePendingMatch, match } from './controller/pending-match-controller';
import { createRoom } from './controller/room-controller';
import { Socket } from 'socket.io';

const frontendUri = process.env.FRONTEND_URI || "http://localhost:3000";

const app = express();
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
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


io.on("connection", (socket: Socket) => {
    const socketId = socket.id;

    console.log("a user connected");
    socket.on("match", async (args) => {
        try {
            const { userId, difficulty } = args;
            console.log("Match is being made");
            console.log("user", userId)
            const match1 = await createPendingMatch(userId, socketId, difficulty);

            // Check if any waiting matches
            const match2 = await match(match1);
            if (match2) {
                const users = [userId, match2.userId];
                const room = await createRoom(users);
                socket.to(socketId).emit("matchSuccess", room._id);
                socket.to(match2.socketId).emit("matchSuccess", room._id);
            }
        } catch (err) {
            console.log(err);
        }
    });

    socket.timeout(MATCH_TIMEOUT).emit("timeout", (err: any) => {
        if (err) {
            console.log(err);
        }
    });

    socket.on("matchSuccess", async (roomId) => {
        await deletePendingMatch(socket.id);
        console.log("room created: ", roomId);
    });

    socket.on("timeout", async () => {
        await deletePendingMatch(socket.id);
        console.log("user timeout");
    });

    socket.on("disconnect", async () => {
        await deletePendingMatch(socket.id);
        console.log("user disconnected");
    });
});

httpServer.listen(process.env.PORT || FALLBACK_PORT);
