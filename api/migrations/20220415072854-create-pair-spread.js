module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PairSpreads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pair: {
        type: Sequelize.STRING
      },
      spread_percent: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PairSpreads');
  }
};
