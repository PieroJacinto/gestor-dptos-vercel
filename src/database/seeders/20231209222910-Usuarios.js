// seeders/XXXXXX-usuarios.js
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed para crear usuarios
    await queryInterface.bulkInsert("Usuarios", [
      {
        id: 1,
        nombre: "Piero",
        email: "pierojacinto@gmail.com",
        contraseña: "$2a$10$3wFXvFJ1VVkQugkrvAts2eGEdikBCHawBi4H5oUYygW.rhFh/LQZm",
        admin: "full-admin",
      },     
      {
        id: 2,
        nombre: "Pilar",
        email: "pilar@gmail.com",
        contraseña: "$2a$10$IqtJtedrjrbmmEqpYIDeX.6ee5sNLAzA.Zz35wxjVsj11HWKHfyU6",
        admin: "corrientes-admin",
      },
      {
        id: 3,
        nombre: "Gamondis",
        email: "ruben@gmail.com",
        contraseña: "$2a$10$vVAsEdVzIIgcXe.yLwytruXg88e5hJUfYOOUJA.qSgdRpbEu4Y9Sa",
        admin: "las-heras-admin",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar los usuarios
    await queryInterface.bulkDelete("Usuarios", null, {});
  },
};

