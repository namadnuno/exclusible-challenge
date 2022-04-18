import { createToken } from "../helpers/jwt";
import User, { createUser, UserInstance } from "../models/user";
import mockDb from "./helpers/mockDb";
import api from "./helpers/api";

describe("users crud", () => {
  beforeEach(async () => {
    await mockDb.up();
  });

  afterEach(async () => {
    await mockDb.down({ to: 0 });
  });

  describe("creation", () => {
    describe("with admin access", () => {
      let admin: UserInstance;
      let token: string;

      beforeEach(async () => {
        admin = await createUser(
          {
            name: "Nuno",
            email: "email@example.com",
            password: "password",
          },
          true
        );

        token = createToken({
          id: admin.id,
          email: admin.email,
        });
      });

      describe("with valid data", () => {
        it("should create the user", async () => {
          const payload = {
            name: "Alex",
            email: "test@example.com",
            password: "password",
          };

          const response = await api
            .post("/users")
            .send(payload)
            .set("X-TOKEN", token);

          expect(response.status).toBe(201);
          expect(response.body.user).toEqual(
            expect.objectContaining({
              name: "Alex",
              email: "test@example.com",
            })
          );
          expect(await User.count()).toBe(2);
        });
      });

      describe("with invalid data", () => {
        it("should return validation messages", async () => {
          const payload = {
            name: "",
            email: "",
            password: "",
          };

          const response = await api
            .post("/users")
            .set("X-TOKEN", token)
            .send(payload);

          console.log({ response });
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

    describe("without admin access", () => {
      it("should deny access to the route", async () => {
        const admin = await createUser(
          {
            name: "Nuno",
            email: "email@example.com",
            password: "password",
          },
          false
        );

        const token = createToken({
          id: admin.id,
          email: admin.email,
        });

        const payload = {
          name: "Alex",
          email: "test@example.com",
          password: "password",
        };

        const response = await api
          .post("/users")
          .set("X-TOKEN", token)
          .send(payload);

        expect(response.status).toBe(403);
        expect(response.text).toEqual("Can't perform this action.");
      });
    });
  });

  describe("reading", () => {
    let admin: UserInstance;
    let token: string;

    beforeEach(async () => {
      admin = await createUser(
        {
          name: "Nuno",
          email: "email@example.com",
          password: "password",
        },
        true
      );

      await createUser(
        {
          name: "Antonio",
          email: "ant@example.com",
          password: "password1",
        },
        false
      );

      token = createToken({
        id: admin.id,
        email: admin.email,
      });
    });

    it("should return all users", async () => {
      const response = await api.get("/users").set("X-TOKEN", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("reading single", () => {
    let admin: UserInstance;
    let token: string;
    let userToFind: UserInstance;

    beforeEach(async () => {
      admin = await createUser(
        {
          name: "Nuno",
          email: "email@example.com",
          password: "password",
        },
        true
      );

      userToFind = await createUser(
        {
          name: "Antonio",
          email: "ant@example.com",
          password: "password1",
        },
        false
      );

      token = createToken({
        id: admin.id,
        email: admin.email,
      });
    });

    it("should return the user", async () => {
      const response = await api
        .get(`/users/${userToFind.id}`)
        .set("X-TOKEN", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Antonio",
          email: "ant@example.com",
        })
      );
    });
  });

  describe("updating", () => {
    let admin: UserInstance;
    let token: string;
    let userToUpdate: UserInstance;

    beforeEach(async () => {
      admin = await createUser(
        {
          name: "Nuno",
          email: "email@example.com",
          password: "password",
        },
        true
      );

      userToUpdate = await createUser({
        name: "Alex",
        email: "alex@example.com",
        password: "password",
      });

      token = createToken({
        id: admin.id,
        email: admin.email,
      });
    });

    describe("with valid data", () => {
      it("should update the user", async () => {
        const payload = {
          name: "Alex Marques",
          email: "alex_1@example.com",
        };

        const response = await api
          .put(`/users/${userToUpdate.id}`)
          .send(payload)
          .set("X-TOKEN", token);

        expect(response.status).toBe(200);
        expect(response.body.user).toEqual(
          expect.objectContaining({
            name: "Alex Marques",
            email: "alex_1@example.com",
          })
        );
        const dbUser = (await User.findOne({
          where: {
            id: userToUpdate.id,
          },
        })) as UserInstance;

        expect(dbUser.name).toBe(payload.name);
        expect(dbUser.email).toBe(payload.email);
      });
    });

    describe("with invalid data", () => {
      it("should return validation messages", async () => {
        const payload = {
          name: "",
          email: "",
        };

        const response = await api
          .put(`/users/${userToUpdate.id}`)
          .send(payload)
          .set("X-TOKEN", token);

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
          ],
        });
      });
    });

    describe("non-existing user", () => {
      it("should return error message", async () => {
        const payload = {
          name: "Alex Marques",
          email: "alex_1@example.com",
        };

        const response = await api
          .put(`/users/20`)
          .send(payload)
          .set("X-TOKEN", token);

        expect(response.status).toBe(404);
        expect(response.text).toEqual("Not Found.");
      });
    });
  });

  describe("deleting", () => {
    let admin: UserInstance;
    let token: string;
    let userToDelete: UserInstance;

    beforeEach(async () => {
      admin = await createUser(
        {
          name: "Nuno",
          email: "email@example.com",
          password: "password",
        },
        true
      );

      userToDelete = await createUser(
        {
          name: "Antonio",
          email: "ant@example.com",
          password: "password1",
        },
        false
      );

      token = createToken({
        id: admin.id,
        email: admin.email,
      });
    });

    it("should delete the user", async () => {
      const response = await api
        .delete(`/users/${userToDelete.id}`)
        .set("X-TOKEN", token);

      expect(response.status).toBe(204);

      const count = await User.count({
        where: {
          email: "ant@example.com",
        },
      });

      expect(count).toBe(0);
    });
  });
});
