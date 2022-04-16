import { Dialect } from "sequelize/types";

const Config = {
    API_PORT: process.env.API_PORT as string,
    MYSQL_USER: process.env.MYSQL_USER as string,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD as string,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE as string,
    DB_DIALECT: process.env.DB_DIALECT as Dialect,
    MYSQL_HOST: process.env.MYSQL_HOST as string,
    NODE_ENV: process.env.NODE_ENV as string,
}

export default Config;
