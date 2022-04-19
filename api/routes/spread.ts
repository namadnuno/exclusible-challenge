import express from "express";
import { body, validationResult } from "express-validator";
import admin from "../middleware/admin";
import PairSpread, { PairSpreadInstance } from "../models/pairspread";

const app = express();

app.get("/", async (req, res) => {
  const pair = req.query.pair ?? "*";

  let spread: PairSpreadInstance | null;

  spread = await PairSpread.findOne({
    where: {
      pair: pair,
    },
  });

  if (!spread) {
    spread = await PairSpread.findOne({
      where: {
        pair: "*",
      },
    });
  }

  res.status(200);
  res.send({ spread });
});

app.post(
  "/",
  admin,
  body("pair").isLength({ min: 3 }),
  body("spread_percent").isFloat({ min: 0, max: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const spreadSearch = await PairSpread.findOne({
      where: {
        pair: req.body.pair,
      },
    });

    if (spreadSearch) {
      spreadSearch.update({
        pair: req.body.pair,
        spread_percent: req.body.spread_percent,
      });
      res.status(200);
      return res.send({ spread: spreadSearch });
    }

    const spread = await PairSpread.create({
      pair: req.body.pair,
      spread_percent: req.body.spread_percent,
    });

    res.status(201);
    res.send({ spread });
  }
);

export default app;
