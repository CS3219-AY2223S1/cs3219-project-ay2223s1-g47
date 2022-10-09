import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

// =========== environment =================
export const ENV_IS_DEV = process.env.ENV == "DEV";
export const ENV_IS_PROD = process.env.ENV == "PROD";

// ============ db config ==================
// if dev, local. staging and prod we use cloud db
export const DB_URI =
  (ENV_IS_DEV ? process.env.DB_LOCAL_URI : process.env.DB_CLOUD_URI) ?? "";

export const DB_LOCAL_JSON_PATH =
  process.env.DB_LOCAL_JSON_PATH ?? "./src/dev-data.json";

export const DB_TABLES = ["questions"];

// ============ app config =================
export const DEFAULT_PORT = 8002;
export const CORS_OPTIONS: cors.CorsOptions = {
  origin: "*", // TODO: currently we allow all origins
};
