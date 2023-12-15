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
          type: DataTypes.STRING(60),
          allowNull:false,
      },
      email: {
          type: DataTypes.STRING(60),
          allowNull:false,
      },
      contraseña:{
          type: DataTypes.STRING(60),
          allowNull:false,
      },
      admin: {
        type: DataTypes.STRING(60),
        allowNull: false,
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Usuarios");
  }
};