// seeders/XXXXXX-departamentos.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Departamentos", [
      {
        id: 1,
        nombre: "Mansilla",
      },
      {
        id: 2,
        nombre: "Corrientes",
      },
      {
        id: 3,
        nombre: "Las-Heras",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departamentos", null, {});
  },
};
