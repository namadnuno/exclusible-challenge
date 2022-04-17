import { SequelizeStorage, Umzug } from "umzug";
import db from "../db";

const migrate = async () => {
  const sequelize = db();
  const umzug = new Umzug({
    migrations: { glob: "migrations/*.js" },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  });

  await umzug.up();
};

migrate();
