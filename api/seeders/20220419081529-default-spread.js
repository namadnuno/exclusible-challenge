module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "PairSpreads",
      [
        {
          pair: "*",
          spread_percent: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("PairSpreads", null, {});
  },
};
