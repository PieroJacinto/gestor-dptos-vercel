const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservas", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      fechaCheckIn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      horaCheckIn: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      fechaCheckOut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      horaCheckOut: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      cantidadHuespedes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      moneda: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      precioPorDia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      restaPagar: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaReserva: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      cantidadDias: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable("Reservas");
  }
};
