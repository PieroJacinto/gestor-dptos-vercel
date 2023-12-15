const bcryptjs = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed para crear usuarios
    await queryInterface.bulkInsert("Usuarios", [
      {
        id: 1,
        nombre: "Piero",
        email: "pierojacinto@gmail.com",
        contraseña: bcryptjs.hashSync("9911", 10),
        admin: "full-admin",
      },     
      {
        id: 2,
        nombre: "Pilar",
        email: "pilar@gmail.com",
        contraseña: bcryptjs.hashSync("9911", 10),
        admin: "corrientes-admin",
      },
      {
        id: 3,
        nombre: "Gamondis",
        email: "ruben@gmail.com",
        contraseña: bcryptjs.hashSync("9911", 10),
        admin: "las-heras-admin",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar los usuarios
    await queryInterface.bulkDelete("Usuarios", null, {});
  },
};
