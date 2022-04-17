import express from "express";
import User, { PublicUserInstance } from "../models/user";
import { body, validationResult } from "express-validator";
import { isValidPassword } from "../helpers/password";
import { createToken } from "../helpers/jwt";

const app = express();

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: PublicUserInstance;
}

export interface JWTUser {
  user_id: number;
  email: string;
}

app.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (
      user === null ||
      !isValidPassword(req.body.password, user.get("password") as string)
    ) {
      res.status(403);
      return res.send({
        message: "Invalid credentials",
      });
    }

    if (user) {
      const token = createToken({
        id: user.get("id") as number,
        email: user.get("email") as string,
      });

      res.status(200);
      res.send({ token, expiresIn: "2h", user });
    }
  }
);

export default app;
