import express from "express";
import { createUser, publicUser, PublicUserInstance } from "../models/user";
import { body, validationResult } from "express-validator";

const app = express();

export interface RegisterResponse {
  user: PublicUserInstance;
}

app.post(
  "/register",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await createUser(req.body);

    res.status(201);
    res.send({
      user: publicUser(user),
    });
  }
);

export default app;
