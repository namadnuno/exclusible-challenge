const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Nuno",
          email: "nuno@mail.com",
          password: bcrypt.hashSync("password", 10),
          is_admin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Alexandre",
          email: "alex@mail.com",
          password: bcrypt.hashSync("password", 10),
          is_admin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("People", null, {});
  },
};
