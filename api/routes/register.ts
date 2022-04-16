import express from "express";
import { hashPassword } from "../helpers/password";
import User, { PublicUserInstance } from "../models/user";
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

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password),
    });

    res.status(201);
    res.send({
      user,
    });
  }
);

export default app;
