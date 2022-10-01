import assert from "assert";
import cors from "cors";

// ======= assertions to check .env ========
assert(process.env.PW_SALT, "PW_SALT not set in .env");
assert(process.env.ENV, "ENV not set in .env");
assert(
  process.env.DB_LOCAL_URI || process.env.DB_CLOUD_URI,
  "db uri not set in .env"
);

// =========== CORS config =================
/**
 * White listed origins for CORS.
 *
 * See https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
 * for more information.
 */
export const CORS_OPTIONS: cors.CorsOptions = {
  origin: "*", // TODO: currently we allow all origins
};

// ============ app config =================
export const DEFAULT_PORT = 8000;

// ======= login handler config ============
export const PW_SALT = process.env.PW_SALT || 10; // some default

// ============ db config ==================
// if dev, local. staging and prod we use cloud db
export const DB_URI =
  (process.env.ENV == "dev"
    ? process.env.DB_LOCAL_URI
    : process.env.DB_CLOUD_URI) ?? "";
