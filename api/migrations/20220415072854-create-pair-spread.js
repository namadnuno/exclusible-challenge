const { Sequelize } = require("sequelize");

module.exports = {
  up: ({ context: queryInterface }) => {
    return queryInterface.createTable("PairSpreads", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pair: {
        type: Sequelize.STRING,
      },
      spread_percent: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: ({ context: queryInterface }) => {
    return queryInterface.dropTable("PairSpreads");
  },
};
