import { DataTypes } from "sequelize";

import db from "../db";
import { hashPassword } from "../helpers/password";

export interface UserAttributes {
  name?: string;
  email?: string;
  password?: string;
  token?: string;
}

export interface UserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  password: string;
  token: string;
}

export interface PublicUserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
}

const User = db().define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  token: DataTypes.STRING,
  is_admin: DataTypes.FLOAT,
});

export const createUser = async (payload: UserAttributes) => {
  return await User.create({
    name: payload.name,
    email: payload.email,
    password: hashPassword(payload.password as string),
  });
}

export default User;
