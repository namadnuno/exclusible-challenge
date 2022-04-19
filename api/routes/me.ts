import express from "express";
import User, { publicUser, PublicUserInstance } from "../models/user";
import { JWTUser } from "./login";

const app = express();

export interface RegisterResponse {
  user: PublicUserInstance;
}

app.get("/me", async (req, res) => {
  const { user_id } = req.user as JWTUser;

  const user = await User.findOne({ where: { id: user_id } });
  if (user) {
    res.status(200);
    return res.send({ me: publicUser(user) });
  }

  res.status(403);
  res.send({ message: "Forbidden" });
});

export default app;
