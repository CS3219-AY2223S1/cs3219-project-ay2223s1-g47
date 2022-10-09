import express from "express";
import cors from "cors";
import questionRoutes from "./routes/question-routes";
import "dotenv/config";
import { CORS_OPTIONS, DEFAULT_PORT } from "./constants";

// ============= require db set up =============
require("./db/db");

// ============= initialize app =================
const app = express();
// see https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
// and https://masteringjs.io/tutorials/express/express-json for more details
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parses incoming json and puts parsed data in req.body. See
app.use(cors(CORS_OPTIONS)); // use and set cors config

// ============== routing =======================
app.use(questionRoutes);

// ============= start server ===================
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => console.log("user-service listening on port " + PORT));

module.exports = app;
