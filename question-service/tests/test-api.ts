import request from "supertest";
import app from "../src/index";
import db from "../src/db/db";

const agent = request.agent(app);

// ================ db set up =================
beforeAll(() => db.connectDb(true));
afterAll(() => db.closeDb());

// ================ test cases =================

/**
 * Test hello world.
 */
describe("get", () => {
  describe("GET /", () => {

    test("empty", async () => {
      const res = await agent.get("/qid/").send();
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeTruthy();
    });


    test("successful", async () => {
      let qid = 1;
      const res = await agent.get(`/qid/?qid=${qid}`).send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.qid = qid)
    });
  });
});

describe("post return q by difficulty", () => {
  describe("post /difficulty", () => {

    test("empty", async () => {
      const res = await agent.post("/difficulty/").send();
      expect(res.statusCode).toEqual(204);
    });

    test("successful", async () => {
      const res = await agent.post("/difficulty/").send({"difficulty":0});
      expect(res.statusCode).toEqual(200);
      expect(res.body.difficulty === 0)
    });

    test("successful", async () => {
      const res = await agent.post("/difficulty/").send({"difficulty":1});
      expect(res.statusCode).toEqual(200);
      expect(res.body.difficulty === 1)
    });



    test("invalid difficulty", async () => {
      const res = await agent.post("/difficulty/").send({"difficulty":99});
      expect(res.statusCode).toEqual(204);
    });



  });
});



