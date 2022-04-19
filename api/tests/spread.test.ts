import { createToken } from "../helpers/jwt";
import { createUser, UserInstance } from "../models/user";
import mockDb from "./helpers/mockDb";
import api from "./helpers/api";
import PairSpread from "../models/pairspread";

describe("spread", () => {
  beforeEach(async () => {
    await mockDb.up();
  });

  afterEach(async () => {
    await mockDb.down({ to: 0 });
  });
  describe("read", () => {
    let admin: UserInstance;
    let token: string;

    beforeEach(async () => {
      admin = await createUser({
        name: "Nuno",
        email: "email@example.com",
        password: "password",
      });

      token = createToken({
        id: admin.id,
        email: admin.email,
      });

      PairSpread.create({ pair: "BTC/USC", spread_percent: 1 });
      PairSpread.create({ pair: "*", spread_percent: 2 });
    });
    it("should return the pair spread", async () => {
      const response = await api
        .get("/spread")
        .set("X-TOKEN", token)
        .query({ pair: "BTC/USC" });

      console.log({ response: response.body });

      expect(response.body.spread).toEqual(
        expect.objectContaining({ pair: "BTC/USC", spread_percent: 1 })
      );
    });

    it("should return the default spread if the given pair does not exist on the db", async () => {
      const response = await api
        .get("/spread")
        .set("X-TOKEN", token)
        .query({ pair: "LTC/USC" });

      console.log({ response: response.body });

      expect(response.body.spread).toEqual(
        expect.objectContaining({ pair: "*", spread_percent: 2 })
      );
    });
  });
  describe("change", () => {
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
        it("should create a spread entry", async () => {
          const payload = {
            pair: "BTC/USB",
            spread_percent: 1,
          };

          const response = await api
            .post("/spread")
            .send(payload)
            .set("X-TOKEN", token);

          expect(response.status).toBe(201);

          const spread = await PairSpread.findOne({
            where: {
              pair: payload.pair,
            },
          });

          expect(spread).not.toBe(null);
          expect(spread?.spread_percent).toBe(1);
        });
      });

      describe("creating existing spread", () => {
        beforeEach(async () => {
          await PairSpread.create({ pair: "BTC/USB", spread_percent: 1 });
        });
        it("should update the spread entry", async () => {
          const payload = {
            pair: "BTC/USB",
            spread_percent: 4,
          };

          const response = await api
            .post("/spread")
            .send(payload)
            .set("X-TOKEN", token);

          expect(response.status).toBe(200);
          expect(response.body.spread).toEqual(
            expect.objectContaining({ pair: "BTC/USB", spread_percent: 4 })
          );

          const spread = await PairSpread.findOne({
            where: {
              pair: payload.pair,
            },
          });

          expect(spread).not.toBe(null);
          expect(spread?.spread_percent).toBe(4);
        });

        describe("with invalid data", () => {
          it("should return a validation error", async () => {
            const payload = {
              pair: "",
              spread_percent: 101,
            };

            const response = await api
              .post("/spread")
              .send(payload)
              .set("X-TOKEN", token);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
              errors: [
                {
                  location: "body",
                  msg: "Invalid value",
                  param: "pair",
                  value: "",
                },
                {
                  location: "body",
                  msg: "Invalid value",
                  param: "spread_percent",
                  value: 101,
                },
              ],
            });
          });
        });
      });
    });

    describe("without admin access", () => {
      let admin: UserInstance;
      let token: string;

      beforeEach(async () => {
        admin = await createUser(
          {
            name: "Nuno",
            email: "email@example.com",
            password: "password",
          },
          false
        );

        token = createToken({
          id: admin.id,
          email: admin.email,
        });
      });

      it("should not create the spread entry", async () => {
        const payload = {
          pair: "BTC/USB",
          spread_percent: 1,
        };

        await api
          .post("/spread")
          .send(payload)
          .set("X-TOKEN", token)
          .expect(403);

        const count = await PairSpread.count({
          where: {
            pair: payload.pair,
          },
        });

        expect(count).toBe(0);
      });
    });
  });
});
