import mongoose, { CallbackError, ConnectOptions } from "mongoose";
import {
  DB_URI,
  ENV_IS_DEV,
  DB_LOCAL_JSON_PATH,
  DB_TABLES,
} from "../constants";
// =================== database ==================

// initialization CRUD handler
const initDb = () => {
  const db = mongoose.connection;

  // 1. if dev, populate
  if (ENV_IS_DEV) {
    // set up
    const fileSystem = require("fs");
    const devDataFilePath = DB_LOCAL_JSON_PATH;
    const tables = DB_TABLES;

    try {
      // clear db
      console.log("Clearing existing tables");
      tables.forEach((table) => {
        db.collection(table).drop();
      });

      // read json file
      console.log("Reading JSON file: " + devDataFilePath);

      const devData = JSON.parse(
        fileSystem.readFileSync(devDataFilePath, "utf8")
      );

      // for each specified table, we populate the db
      console.log("Repopulating tables");
      tables.forEach((table: string) => {
        console.log("Reading table: " + table);
        const entries = devData[table];
        db.collection(table).insertMany(entries);
      });
    } catch (error) {
      throw error;
    }
  }

  // 2. if prod, do nothing
};

// connect to db
console.log("\nOpening DB connection: " + DB_URI);
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to DB");
    initDb();
    console.log("DB initialization complete");
  })
  .catch((error: CallbackError) => {
    console.error("MongoDB initialization error!", error);
  });
