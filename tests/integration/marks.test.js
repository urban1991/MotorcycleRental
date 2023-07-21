const request = require("supertest");
const mongoose = require("mongoose");
const {Mark} = require("../../models/mark");
const {User} = require("../../models/user");

let server;

describe("/api/marks", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Mark.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all marks", async () => {
      const marks = [{mark: "mark1"}, {mark: "mark2"}];
      await Mark.collection.insertMany(marks);

      const res = await request(server).get("/api/marks");
      expect(res.status).toBe(200);
      // expect(res.body.length).toBe(2);
      expect(res.body.some((m) => m.mark === "mark1")).toBeTruthy();
      expect(res.body.some((m) => m.mark === "mark2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return mark if valid id is passed", async () => {
      const mark = new Mark({mark: "mark1"});
      await mark.save();

      const res = await request(server).get(`/api/marks/${mark._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("mark", mark.mark);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/marks/1");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if no mark with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/marks/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let mark;
    const exec = async () =>
      await request(server)
        .post("/api/marks")
        .set("x-auth-token", token)
        .send({mark});

    beforeEach(() => {
      token = new User().generateAuthToken();
      mark = "mark1";
    });

    it("should return 401 if client is not logged", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if mark is less than 3 characters", async () => {
      mark = "ma";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if mark is higher than 50 characters", async () => {
      mark = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save mark if it is valid", async () => {
      await exec();

      const mark = await Mark.find({mark: "mark1"});
      expect(mark).not.toBe(null);
    });

    it("should save mark if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("mark", "mark1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let mark;
    let newMark;
    let id;

    beforeEach(async () => {
      mark = new Mark({mark: "mark1"});
      await mark.save();

      token = new User().generateAuthToken();
      id = mark._id;
      newMark = "updatedMark";
    });

    const exec = async () =>
      await request(server)
        .put(`/api/marks/${id}`)
        .set("x-auth-token", token)
        .send({mark: newMark});

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if mark is less than 3 characters", async () => {
      newMark = "ma";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if mark is more than 50 characters", async () => {
      newMark = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if mark with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the mark if input is valid", async () => {
      await exec();

      const updatedMark = await Mark.findById(mark._id);

      expect(updatedMark.mark).toBe(newMark);
    });

    it("should return the updated mark if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("mark", newMark);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let mark;
    let id;

    const exec = async () =>
      await request(server)
        .delete(`/api/marks/${id}`)
        .set("x-auth-token", token)
        .send();

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      mark = new Mark({mark: "mark1"});
      await mark.save();

      id = mark._id;
      token = new User({isAdmin: true}).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({isAdmin: false}).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no mark with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the mark if input is valid", async () => {
      await exec();

      const markInDb = await Mark.findById(id);

      expect(markInDb).toBeNull();
    });

    it("should return the removed mark", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", mark._id.toHexString());
      expect(res.body).toHaveProperty("mark", mark.mark);
    });
  });
});
