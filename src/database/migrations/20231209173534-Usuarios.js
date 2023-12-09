const { DataTypes } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Usuarios", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      nombre: 
      { 
          type: DataTypes.STRING(500),
          allowNull:false,
      },
      email: {
          type: DataTypes.STRING(500),
          allowNull:false,
      },
      contraseña:{
          type: DataTypes.STRING(500),
          allowNull:false,
      },
      admin: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      departamento: {
        type: DataTypes.STRING(500),
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Usuarios");
  }
};