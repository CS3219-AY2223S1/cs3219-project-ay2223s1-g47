import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createPendingMatch, deletePendingMatch, match } from './controller/pending-match-controller.js';
import { createRoom } from './controller/room-controller.js';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const currentUser = null;

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});


io.on("connection", (socket) => {
    const socketId = socket.id;

    console.log("a user connected");
    socket.on("match", async () => {
        console.log("Match is being made");
        const match1 = await createPendingMatch(currentUser, socketId);

        // Check if any waiting matches
        const match2 = await match(match1);
        if (match2) {
            const room = await createRoom([currentUser, match2.userId]);
            socket.to(socketId).emit("matchSuccess", room._id);
            socket.to(match2.socketId).emit("matchSuccess", room._id);
        }
    });

    socket.timeout(60000).emit("timeout", (err) => {
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

httpServer.listen(8001);
