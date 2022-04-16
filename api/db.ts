import { Sequelize } from "sequelize";
import Config from "./config";

const db = () => {
  if (Config.NODE_ENV !== 'test') {
    return new Sequelize(
      Config.MYSQL_DATABASE,
      Config.MYSQL_USER,
      Config.MYSQL_PASSWORD, {
      dialect: Config.DB_DIALECT,
      host: Config.MYSQL_HOST,
      logging: process.env.NODE_ENV === 'dev' 
    }
    );
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
  });
}

export default db;
