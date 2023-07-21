const request = require("supertest");
const {User} = require("../../models/user");
const {Mark} = require("../../models/mark");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Mark.deleteMany({});
    await server.close();
  });
  let token;
  const exec = () =>
    request(server)
      .post("/api/marks")
      .set("x-auth-token", token)
      .send({mark: "mark1"});

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token was provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if  token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
