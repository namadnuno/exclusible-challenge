import jwt from "jsonwebtoken";
import express from "express";
import Config from "../config";
import { JWTUser } from "../routes/login";
import User from "../models/user";

const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.query.token || req.headers["x-token"];

  if (!token) {
    res.status(403);
    return res.send("Invalid token");
  }

  if (token) {
    try {
      const decoded = jwt.verify(token as string, Config.API_KEY);
      req.user = decoded as JWTUser;

      if ((await User.count({ where: { id: req.user.user_id } })) === 0) {
        throw new Error("Invalid user");
      }
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  }
  return next();
};

export default verifyToken;
