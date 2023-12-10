// migraciones/XXXXXX-UsuarioDepartamento.js
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsuarioDepartamento", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
      departamentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Departamentos",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UsuarioDepartamento");
  }
};
