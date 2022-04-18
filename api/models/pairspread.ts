import { DataTypes, Model } from "sequelize";

import db from "../db";

export interface PairSpreadAttributes {
  pair: string;
  spread_percent: number;
}

export interface PairSpreadInstance extends Model {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  pair: string;
  spread_percent: number;
}

const PairSpread = db().define<PairSpreadInstance, PairSpreadAttributes>(
  "PairSpread",
  {
    pair: DataTypes.STRING,
    spread_percent: DataTypes.FLOAT,
  }
);

export default PairSpread;
