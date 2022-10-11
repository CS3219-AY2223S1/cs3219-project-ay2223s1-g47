import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { listenForMatches } from './services/socket';
import { Socket } from 'socket.io';

const frontendUri = process.env.FRONTEND_URI || "http://localhost:3000";
const app = express();
export const httpServer = createServer(app);
export const io = require("socket.io")(httpServer, {
    cors: {
      origin: frontendUri,
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use

const FALLBACK_PORT = 8001; // localhost port

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

export const onMatchSuccess = (socket1: Socket, socket2: Socket, room: any) => {
    if (socket1 && socket2) {
        socket1.emit("matchSuccess", room);
        socket2.emit("matchSuccess", room);
    }
    console.log("matchSuccess");
}

listenForMatches();

httpServer.listen(process.env.PORT || FALLBACK_PORT);
