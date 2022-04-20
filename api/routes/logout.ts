import express from "express";
import User, { PublicUserInstance } from "../models/user";
import { JWTUser } from "./login";

const app = express();

export interface RegisterResponse {
  user: PublicUserInstance;
}

app.post("/", async (req, res) => {
  const { user_id } = req.user as JWTUser;

  const user = await User.findOne({ where: { id: user_id } });
  if (user) {
    user.update({ token: null });
  } else {
    throw new Error(`Something went Wrong`);
  }

  res.status(204);
  res.send("");
});

export default app;
