import { DataTypes, Model } from "sequelize";

import db from "../db";
import { hashPassword } from "../helpers/password";

export interface UserAttributes {
  name?: string;
  email?: string;
  password?: string;
  token?: string;
  is_admin?: boolean;
}

export interface UserInstance extends Model {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  password: string;
  token: string;
  is_admin: boolean;
}

export interface PublicUserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
}

const User = db().define<UserInstance, UserAttributes>("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  token: DataTypes.STRING,
  is_admin: DataTypes.FLOAT,
});

export const createUser = async (payload: UserAttributes, isAdmin = false) => {
  return await User.create({
    name: payload.name,
    email: payload.email,
    password: hashPassword(payload.password as string),
    is_admin: isAdmin,
  });
};

export default User;
