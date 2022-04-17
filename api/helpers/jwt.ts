import Config from "../config";
import { UserInstance } from "../models/user";
import jwt from "jsonwebtoken";

export const createToken = (userData: Pick<UserInstance, "id" | "email">) =>
  jwt.sign(
    {
      user_id: userData.id,
      email: userData.email,
    },
    Config.API_KEY,
    {
      expiresIn: "2h",
    }
  );
