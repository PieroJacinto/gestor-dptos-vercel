const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Gastos", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      tipoGasto: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      departamentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Departamentos", // Nombre de la tabla referenciada
          key: "id", // Clave primaria de la tabla referenciada
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Gastos");
  }
};
