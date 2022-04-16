import {
    DataTypes
} from 'sequelize';

import db from '../db';

export interface UserAttributes {
    name ? : string;
    email ? : string;
    password ? : string;
    token ? : string;

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

const User = db().define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    is_admin: DataTypes.FLOAT
});

export default User;
