const { Sequelize } = require('sequelize');

module.exports = {
  up: ({ context: queryInterface }) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        type: Sequelize.STRING
      },

      email: {
        type: Sequelize.STRING
      },

      password: {
        type: Sequelize.STRING
      },

      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      token: {
        type: Sequelize.STRING
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

  down: ({ context: queryInterface }) => {
    return queryInterface.dropTable('Users');
  }
};
