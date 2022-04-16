import { DataTypes } from "sequelize";

import db from "../db";

export interface PairSpreadAttributes {
  pair: string;
  spread_percent: number;
}

export interface PairSpreadInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  pair: string;
  spread_percent: number;
}

const PairSpread = db().define("PairSpread", {
  pair: DataTypes.STRING,
  spread_percent: DataTypes.FLOAT,
});

export default PairSpread;
