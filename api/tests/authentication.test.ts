import { isValidPassword } from "../helpers/password";
import User, { createUser, UserInstance } from "../models/user";
import mockDb from "./helpers/mockDb";
import jwt from "jsonwebtoken";
import { createToken } from "../helpers/jwt";
import api from "./helpers/api";

describe("authentication flow", () => {
  beforeEach(async () => {
    await mockDb.up();
  });

  afterEach(async () => {
    await mockDb.down({ to: 0 });
  });

  describe("register", () => {
    describe("user register with valid data", () => {
      const registerPayload = {
        name: "Nuno",
        email: "nuno@gmail.com",
        password: "password",
      };

      it("should create the user in DB", async () => {
        const response = await api.post("/register").send(registerPayload);

        expect(response.status).toEqual(201);

        const dbUsers = await User.findAll();
        expect(dbUsers.length).toBe(1);

        expect(dbUsers[0].name).toBe(registerPayload.name);
        expect(dbUsers[0].email).toBe(registerPayload.email);
      });

      it("should hash user password", async () => {
        await api.post("/register").send(registerPayload);

        const dbUsers = await User.findAll();
        const savedPassword = dbUsers[0].password;
        expect(savedPassword).not.toBe(registerPayload.password);
        expect(
          isValidPassword(registerPayload.password, savedPassword as string)
        ).toBe(true);
      });
    });

    describe("user register with invalid data", () => {
      it("should show validation errors", async () => {
        const registerPayload = {
          name: "",
          email: "",
          password: "",
        };
        const response = await api.post("/register").send(registerPayload);

        expect(response.status).toBe(422);
        expect(response.body).toEqual({
          errors: [
            {
              location: "body",
              msg: "Invalid value",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "Invalid value",
              param: "email",
              value: "",
            },
            {
              location: "body",
              msg: "Invalid value",
              param: "password",
              value: "",
            },
          ],
        });
      });
    });
  });

  describe("login", () => {
    describe("user sign in with valid data", () => {
      const userData = {
        name: "Nuno",
        email: "nuno@gmail.com",
        password: "password",
      };

      let user: UserInstance;

      beforeEach(async () => {
        user = await createUser(userData);
      });

      it("should return the user signed token", async () => {
        const response = await api.post("/login").send({
          email: userData.email,
          password: userData.password,
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.expiresIn).toBeTruthy();
        expect(response.body.user.name).toBe(userData.name);

        const verifiedToken = jwt.verify(
          response.body.token,
          process.env.API_KEY as string
        ) as {
          user_id: number;
          email: string;
        };

        expect(verifiedToken.user_id).toBe(user.id);
        expect(verifiedToken.email).toBe(user.email);
      });
    });

    describe("user sign in with invalid data", () => {
      it("should return an error response", async () => {
        const userData = {
          email: "",
          password: "",
        };

        await api
          .post("/login")
          .send({
            email: userData.email,
            password: userData.password,
          })
          .expect(422);
      });
    });

    describe("sign in with non existent user", () => {
      it("should return Invalid credentials error response", async () => {
        const userData = {
          email: "nuno@gmail.com",
          password: "password",
        };

        const response = await api.post("/login").send({
          email: userData.email,
          password: userData.password,
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
      });
    });

    describe("user sign in with invalid password", () => {
      const userData = {
        name: "Nuno",
        email: "nuno@gmail.com",
        password: "password",
      };

      beforeEach(async () => {
        await createUser(userData);
      });

      it("should return the Invalid Credentials error", async () => {
        const response = await api.post("/login").send({
          email: userData.email,
          password: "invalid",
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
      });
    });
  });

  describe("logout", () => {
    describe("with valid token", () => {
      const userData = {
        name: "Nuno",
        email: "nuno@gmail.com",
        password: "password",
      };

      let token: string;

      beforeEach(async () => {
        const user = await createUser(userData);
        token = createToken({
          id: user.id,
          email: user.email,
        });
      });

      it("should remove token from user", async () => {
        const response = await api.post("/logout").set("X-TOKEN", token);

        expect(response.status).toBe(204);

        const user = await User.findOne({
          where: { email: userData.email },
        });

        if (user) {
          expect(user.token).toBe(null);
        }
      });
    });

    describe("with invalid token", () => {
      it("should return invalid token response", async () => {
        await api.post("/logout").set("X-TOKEN", "123").expect(401);
      });
    });

    describe("with invalid token with removed user data", () => {
      it("should return invalid token response", async () => {
        const token = createToken({ id: 3, email: "test@gmail.com" });
        await api.post("/logout").set("X-TOKEN", token).expect(401);
      });
    });
  });
});
