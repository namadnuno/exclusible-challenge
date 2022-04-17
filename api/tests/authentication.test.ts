import { AxiosError, AxiosResponse } from "axios";
import { isValidPassword } from "../helpers/password";
import User, { createUser, UserInstance } from "../models/user";
import { LoginResponse } from "../routes/login";
import { RegisterResponse } from "../routes/register";
import api from "./helpers/api";
import mockDb from "./helpers/mockDb";
import jwt from "jsonwebtoken";
import { Model } from "sequelize/types";

require("./helpers/runApp");

describe("authentication flow", () => {
  beforeEach(async () => {
    await mockDb.up();
  });

  afterEach(async () => {
    await mockDb.down({ to: 0 });
  });

  describe("register", () => {
    describe("user register with valid data", () => {
      let response: AxiosResponse<RegisterResponse>;

      const registerPayload = {
        name: "Nuno",
        email: "nuno@gmail.com",
        password: "password",
      };

      beforeEach(async () => {
        response = await api().post("/register", registerPayload);
      });

      it("should create the user in DB", async () => {
        expect(response.status).toEqual(201);

        const dbUsers = await User.findAll();
        expect(dbUsers.length).toBe(1);

        expect(dbUsers[0].get("name")).toBe(registerPayload.name);
        expect(dbUsers[0].get("email")).toBe(registerPayload.email);
      });

      it("should hash user password", async () => {
        const dbUsers = await User.findAll();
        const savedPassword = dbUsers[0].get("password");
        expect(savedPassword).not.toBe(registerPayload.password);
        expect(
          isValidPassword(registerPayload.password, savedPassword as string)
        ).toBe(true);
      });
    });

    describe("user register with invalid data", () => {
      let errorResponse: AxiosError<{
        errors: Array<Record<string, string>>;
      }>;

      const registerPayload = {
        name: "",
        email: "",
        password: "",
      };

      beforeEach(async () => {
        try {
          await api().post("/register", registerPayload);
        } catch (e) {
          errorResponse = e;
        }
      });

      it("should show validation errors", () => {
        expect(errorResponse).not.toBeUndefined();
        if (errorResponse && errorResponse.response) {
          expect(errorResponse.response.status).toBe(422);
          expect(errorResponse.response.data).toEqual({
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
        }
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

      let user: Model<UserInstance, any>;

      beforeEach(async () => {
        user = await createUser(userData);
      });

      it("should return the user signed token", async () => {
        const response = await api().post<LoginResponse>("/login", {
          email: userData.email,
          password: userData.password,
        });

        expect(response.status).toBe(200);
        expect(response.data.token).toBeTruthy();
        expect(response.data.expiresIn).toBeTruthy();
        expect(response.data.user.name).toBe(userData.name);

        const verifiedToken = jwt.verify(
          response.data.token,
          process.env.API_KEY as string
        ) as {
          user_id: number;
          email: string;
        };

        expect(verifiedToken.user_id).toBe(user.get("id"));
        expect(verifiedToken.email).toBe(user.get("email"));
      });
    });

    describe("user sign in with invalid data", () => {
      const userData = {
        email: "",
        password: "",
      };

      it("should return an error response", async () => {
        expect(() =>
          api().post<LoginResponse>("/login", {
            email: userData.email,
            password: userData.password,
          })
        ).rejects.toThrowError("Request failed with status code 422");
      });
    });

    describe("sign in with non existent user", () => {
      const userData = {
        email: "nuno@gmail.com",
        password: "password",
      };

      it("should return Invalid credentials error response", async () => {
        try {
          await api().post<LoginResponse>("/login", {
            email: userData.email,
            password: userData.password,
          });
        } catch (e) {
          expect(e.response.status).toBe(403);
          expect(e.response.data.message).toBe("Invalid credentials");
        }
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
        try {
          await api().post<LoginResponse>("/login", {
            email: userData.email,
            password: "invalid",
          });
        } catch (e) {
          expect(e.response.status).toBe(403);
          expect(e.response.data.message).toBe("Invalid credentials");
        }
      });
    });
  });
});
