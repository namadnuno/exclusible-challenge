import Config from "../config";
import User, { UserInstance } from "../models/user";
import jwt from "jsonwebtoken";

export const createToken = (userData: Pick<UserInstance, "id" | "email">) => {
  const token = jwt.sign(
    {
      user_id: userData.id,
      email: userData.email,
    },
    Config.API_KEY,
    {
      expiresIn: "2h",
    }
  );

  User.update({ token }, { where: { id: userData.id } });

  return token;
};
