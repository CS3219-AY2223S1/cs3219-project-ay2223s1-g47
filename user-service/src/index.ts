import express, { Express, Request, Response, Router } from "express";
import cors from "cors";
import { CORS_OPTIONS, DEFAULT_PORT } from "./constants";
import {
  handleCreateUser,
  login,
  auth,
  logout,
} from "./controller/user-controller";

// ======= initialize stuff with require ========
require("./db/db");

// ============== start the app =================
const app: Express = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// ============== middleware config =============
// see https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
// and https://masteringjs.io/tutorials/express/express-json for more details
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parses incoming json and puts parsed data in req.body. See
app.use(cors(CORS_OPTIONS)); // use and set cors config

// =================== routing ==================

/**
 * Basic hello world ping.
 */
app.get("/", (request: Request, response: Response) =>
  response.send("Hello World from user-service")
);

/**
 * Endpoint to create a new user.
 */
app.post("/signup", handleCreateUser);

/**
 * Endpoint to login.
 */
app.post("/login", login);

/**
 * Endpoint to logout.
 */
app.post("/logout", logout);

/**
 * Endpoint to ping for authentication. Assumes that the user has cookies
 * to use for authentication.
 */
app.get("/auth", auth);

// listen
app.listen(PORT, () => console.log("user-service listening on port 8000"));
