import request from "supertest";
import app from "../src/index";
import db from "../src/db/db";

const agent = request.agent(app);

// ================ db set up =================
beforeEach(() => db.connectDb(true));
afterEach(() => db.closeDb());

// ================ test cases =================

/**
 * Test hello world.
 */
 describe("get", () => {
    describe("GET /", () => {
      test("successful", async () => {});
    });
  });