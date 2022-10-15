import request from "supertest";
import app from "../src/index";
import db from "../src/db/db";

const agent = request.agent(app);

// ================ db set up =================
beforeAll(async () => await db.connectDb(true));
afterAll(async () => await db.closeDb());

// ================ test cases =================

/**
 * Test hello world.
 */
describe("get", () => {
  describe("GET /", () => {
    test("successful", async () => {
      const res = await agent.get("/").send();
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual("Hello World from user-service");
      expect(res.body).toBeTruthy();
    });
  });
});

/**
 * Test signup.
 */
describe("signup", () => {
  describe("POST /", () => {
    // successful signup
    test("successful", async () => {
      const res = await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeTruthy();
    });

    // duplicate username
    test("failed duplicate creation", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      const res = await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      expect(res.statusCode).toEqual(500);
    });

    // empty username
    test("bad username", async () => {
      const res = await agent
        .post("/signup")
        .send({ username: " ", password: "testpw" });
      expect(res.statusCode).toEqual(400);
    });
  });
});

/**
 * Test login.
 */
describe("login", () => {
  describe("POST /", () => {
    // successful login
    test("successful", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      const res = await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      expect(res.statusCode).toEqual(200);
    });

    // no such login
    test("wrong account fail", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      const res = await agent
        .post("/login")
        .send({ username: "user2", password: "testpw" });
      expect(res.statusCode).toEqual(401);
    });

    // no rush account
    test("no account fail", async () => {
      const res = await agent
        .post("/login")
        .send({ username: "user2", password: "testpw" });
      expect(res.statusCode).toEqual(401);
    });
  });
});

describe("auth", () => {
  describe("get /", () => {
    // auth fails
    test("fail_without_login", async () => {
      const res = await agent.get("/auth");
      expect(res.statusCode).toEqual(401);
    });

    // auth succeeds
    test("successful", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      const res = await agent.get("/auth");
      expect(res.statusCode).toEqual(200);
    });
  });
});

describe("logout", () => {
  describe("get /", () => {
    // logout succeeds
    test("logout of account", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      const res = await agent.post("/logout").send();
      expect(res.statusCode).toEqual(200);
    });

    // check that logout actually works
    test("no auth after logout", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      await agent.post("/logout").send();
      const res = await agent.get("/auth");
      expect(res.statusCode).toEqual(401);
    });

    // check that logout then relogin is ok
    test("relogin", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      await agent.post("/logout").send();
      const res = await agent.get("/auth");
      expect(res.statusCode).toEqual(401);
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      const res2 = await agent.get("/auth");
      expect(res2.statusCode).toEqual(200);
    });
  });
});

describe("change credentials", () => {
  describe("get /", () => {
    // can only change when logged in
    test("fail without login", async () => {
      const res = await agent
        .put("/changeUsername")
        .send({ username: "user1", password: "testpw" });
      expect(res.statusCode).toEqual(401);
      const res1 = await agent
        .put("/changePassword")
        .send({ username: "user1", password: "testpw" });
      expect(res1.statusCode).toEqual(401);
    });

    // change username
    test("change username", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      await agent
        .put("/changeUsername")
        .send({ username: "user2", password: "testpw" });
      const res = await agent
        .post("/login")
        .send({ username: "user2", password: "testpw" });
      expect(res.statusCode).toEqual(200);
      const res1 = await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      expect(res1.statusCode).toEqual(401);
    });

    // change password
    test("change password", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      await agent
        .put("/changePassword")
        .send({ username: "user1", password: "testpw2" });
      const res = await agent
        .post("/login")
        .send({ username: "user1", password: "testpw2" });
      expect(res.statusCode).toEqual(200);
      const res1 = await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      expect(res1.statusCode).toEqual(401);
    });

    // auth login status persists
    test("stay logged in after change", async () => {
      await agent
        .post("/signup")
        .send({ username: "user1", password: "testpw" });
      await agent
        .post("/login")
        .send({ username: "user1", password: "testpw" });
      await agent
        .put("/changePassword")
        .send({ username: "user1", password: "testpw2" });
      const res = await agent.get("/auth");
      expect(res.statusCode).toEqual(200);
    });
  });
});
