const User = require("../../models/user-model");
const request = require("supertest");
var chai = require("chai");
var sinon = require("sinon");

var expect = chai.expect;
var { app } = require("../../server");

process.env.NODE_ENV = "test";

const deleteMeUser = {
  username: "deleteMe",
  email: "deleteMe@gmail.com",
  password: "deleteMe",
  password2: "deleteMe"
};

const alreadyExistUser = {
  username: "alreadyExistUser",
  email: "alreadyExistUser@gmail.com",
  password: "alreadyExistUser",
  password2: "alreadyExistUser"
};

var alreadyExistUserConfJWT = "";

before(async () => {
  await User.deleteOne({ email: "deleteMe@gmail.com" }, err => {
    if (err) console.log("deleteMe user not found");
  });
  await new User(alreadyExistUser).save();
  sinon.stub(console, "log");
});

after(async () => {
  if (!console.log.restore) sinon.stub(console, "log");
  await User.deleteOne({ email: "deleteMe@gmail.com" }, err => {
    if (err) console.log("deleteMe user not found");
  });
  await User.deleteOne({ email: "alreadyExistUser@gmail.com" }, err => {
    if (err) console.log("alreadyExistUser user not found");
  });
});

describe("api/register", () => {
  describe("#get/api/register/test", () => {
    it("should return working", done => {
      request(app)
        .get("/api/register/test")
        .expect(200)
        .expect(res => {
          expect(res.body.msg).to.equal("working");
        })
        .end(done);
    });
  });

  describe("#get/api/register/local", () => {
    it("should return empty fields errors", done => {
      const expectedRes = {
        username: "Please enter a username",
        email: "Please enter a valid email",
        password: "Please enter your password with minimum 5 characters",
        password2: "Please confirm your password"
      };
      request(app)
        .post("/api/register/local", {})
        .expect(422)
        .expect(res => {
          expect(res.body.errors).to.deep.equal(expectedRes);
        })
        .end(done);
    });

    it("should create user", done => {
      request(app)
        .post("/api/register/local")
        .send(deleteMeUser)
        .expect(200)
        .expect(async res => {
          expect(res.body.user)
            .to.be.an("object")
            .that.has.all.keys(
              "confirmed",
              "_id",
              "username",
              "email",
              "password",
              "confirmationJWT",
              "__v"
            );
          expect(res.body.user.confirmed).to.equal(false);
          expect(res.body.emailSent).to.equal("success");
          const dbUser = await User.findOne({ email: res.body.user.email });
          expect(dbUser.confirmationJWT).to.equal(
            res.body.user.confirmationJWT
          );
          expect(dbUser.confirmed).to.equal(false);
        })
        .end(done);
    });

    it("should return already exists error", done => {
      const expectedErr = {
        email: "Email already exists"
      };
      request(app)
        .post("/api/register/local")
        .send(alreadyExistUser)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).to.deep.equal(expectedErr);
        })
        .end(done);
    });

    it("should confirm user", async () => {
      const user = await User.findOne({ email: alreadyExistUser.email });
      alreadyExistUserConfJWT = user.confirmationJWT;
      request(app)
        .post("/api/register/confirmation")
        .send({ token: alreadyExistUserConfJWT })
        .expect(200)
        .expect(async res => {
          expect(res.body.confirmation).to.equal("Success");
          const dbUser = await User.findOne({ email: user.email });
          expect(dbUser.confirmationJWT).to.equal("");
          expect(dbUser.confirmed).to.equal(true);
        });
    });

    it("should return error token invalid", async () => {
      request(app)
        .post("/api/register/confirmation")
        .send({ token: alreadyExistUserConfJWT })
        .expect(400)
        .expect(async res => {
          expect(res.body.msg).to.equal("Token is invalid");
        });
    });
  });
});
