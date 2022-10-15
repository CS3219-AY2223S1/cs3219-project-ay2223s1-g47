const app = require("../dist/index");
const request = require("supertest");

const difficulty = "Medium";
const postBody = {
  questionIds: ["633dbfde101bea946c7a30ef", "633dbfde101bea946c7a30f2"],
};

// ============= test get question by difficulty =============

describe("GET one question success", () => {
  test("Should respond with status code 200", async () => {
    const res = await request(app)
      .post(`/difficulty/${difficulty}`)
      .send(postBody);
    expect(res.statusCode).toBe(200);
  });

  test("Should specify json in content type header", async () => {
    const res = await request(app)
      .post(`/difficulty/${difficulty}`)
      .send(postBody);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  test("Should contain required fields in response body", async () => {
    const res = await request(app)
      .post(`/difficulty/${difficulty}`)
      .send(postBody);
    expect(res.body.qid).toBeDefined();
    expect(res.body.title).toBeDefined();
    expect(res.body.description).toBeDefined();
    expect(res.body.difficulty).toBeDefined();
    expect(res.body.topic).toBeDefined();
  });
});

describe("GET one question fail", () => {
  describe("Wrong format for post body", () => {
    test("Should respond with status code 404", async () => {
      const res = await request(app).post(`/difficulty/${difficulty}`).send({});
      expect(res.statusCode).toBe(404);
    });

    test("Should respond with error message", async () => {
      const res = await request(app).post(`/difficulty/${difficulty}`).send({});
      expect(res.body.message).toBe("Wrong format for POST request body");
    });
  });

  describe("Invalid value for difficulty", () => {
    test("Should respond with status code 404", async () => {
      const res = await request(app).post(`/difficulty/Middle`).send(postBody);
      expect(res.statusCode).toBe(404);
    });

    test("Should respond with error message", async () => {
      const res = await request(app).post(`/difficulty/Middle`).send(postBody);
      expect(res.body.message).toBe("No questions found");
    });
  });
});