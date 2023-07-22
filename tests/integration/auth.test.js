const request = require("supertest");
const {User} = require("../../models/user");
const {Brand} = require("../../models/brand");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await Brand.deleteMany({});
    await server.close();
  });
  let token;
  const exec = () =>
    request(server)
      .post("/api/brands")
      .set("x-auth-token", token)
      .send({brand: "brand1"});

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
