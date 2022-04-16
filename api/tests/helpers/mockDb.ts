import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const sequelize = new Sequelize({ dialect: "sqlite", storage: "./db.sqlite" });

export default new Umzug({
  migrations: { glob: "migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});
