import express from "express";
import cors from "cors";
import { createServer } from "http";
import questionRoutes from "./routes/question-routes.js"
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());
app.options("*", cors());

app.use(questionRoutes).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

const httpServer = createServer(app);
httpServer.listen(process.env.PORT || 8002, () => console.log('question-service listening on port 8002'));
