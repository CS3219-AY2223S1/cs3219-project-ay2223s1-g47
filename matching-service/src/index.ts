import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { listenForMatches } from './services/socket';

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

listenForMatches();

httpServer.listen(process.env.PORT || FALLBACK_PORT);
