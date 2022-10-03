"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const question_routes_js_1 = __importDefault(require("./routes/question-routes.js"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.options("*", (0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(question_routes_js_1.default);
// app.use(questionRoutes).all((_, res) => {
//     res.setHeader('content-type', 'application/json')
//     res.setHeader('Access-Control-Allow-Origin', '*')
// })
const httpServer = (0, http_1.createServer)(app);
httpServer.listen(process.env.PORT || 8002, () => console.log('question-service listening on port 8002'));
