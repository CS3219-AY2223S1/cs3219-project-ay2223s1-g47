import mongoose, { CallbackError, ConnectOptions } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DB_URI, DB_LOCAL_JSON_PATH, DB_TABLES,ENV_IS_DEV } from "../constants";
// =================== database ==================


// =================== database ==================
// global mock db variable we use for tests
let mock_db: MongoMemoryServer | null = null;


// initialization CRUD handler
const populateDevDb = async () => {
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
      tables.forEach(async (table) => {
        await db.collection(table)
          .drop()
          .catch((error) => {
            console.error("Tried to drop table " + table + " but some error.");
            console.error(error);
          });
      });

      // read json file
      console.log("Reading JSON file: " + devDataFilePath);

      const devData = JSON.parse(
        fileSystem.readFileSync(devDataFilePath, "utf8")
      );

      // for each specified table, we populate the db
      console.log("Repopulating tables");
      tables.forEach(async (table: string) => {
        console.log("Reading table: " + table);
        const entries = devData[table];
        await db.collection(table).insertMany(entries);
      });
    } catch (error) {
      throw error;
    }
  }

  // 2. if prod, do nothing
};


/**
 * Sets up the database connection. If test is true, it will connect to the test database, intended for use
 * for local testing.
 */
 const connectDb = async (test: boolean) => {
  // 1. connection
  let dbURI_candidate = DB_URI;
  if (test) {
    mock_db = await MongoMemoryServer.create();
    dbURI_candidate = mock_db.getUri();
  }
  const dbURI = dbURI_candidate;
  console.log("\nOpening DB connection: " + dbURI);
  const connection = await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  // 2. initialization
  // if (!test) {
    await populateDevDb();
  // }

  // 3. log
  console.log("DB connection complete!");
};

/**
 * Closes the database connection.
 */
const closeDb = async () => {
  console.log("Closing DB connection");
  await mongoose.connection.close();
  if (mock_db) {
    await mock_db.stop();
  }
};

export default { connectDb, closeDb };
