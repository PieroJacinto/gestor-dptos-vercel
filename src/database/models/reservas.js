module.exports = function (sequelize, dataTypes) {
    let alias = "Reserva";
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: dataTypes.STRING(500),
        allowNull: false,
      },
      telefono: {
        type: dataTypes.STRING(20),
        allowNull: true,
      },
      fechaCheckIn: {
        type: dataTypes.DATEONLY,
        allowNull: false,
      },
      horaCheckIn: {
        type: dataTypes.TIME,
        allowNull: true,
      },
      fechaCheckOut: {
        type: dataTypes.DATEONLY,
        allowNull: false,
      },
      horaCheckOut: {
        type: dataTypes.TIME,
        allowNull: true,
      },
      cantidadHuespedes: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      moneda: {
        type: dataTypes.STRING(3),
        allowNull: false,
      },
      precioPorDia: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      senia: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      total: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      restaPagar: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      fechaReserva: {
        type: dataTypes.DATEONLY,
        allowNull: false,
      },
      cantidadDias: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      departamentoId: {
        type:dataTypes.INTEGER,
        allownull: false,
    }

    };
    let config = {
      tableName: "Reservas",
      timestamps: false,
    };
  
    const Reserva = sequelize.define(alias, cols, config);
  
    // Relación entre Reserva y Departamento
    Reserva.associate = (models) => {
        Reserva.belongsTo(models.Departamento, {
          foreignKey: "departamentoId",
          as: "Departamento", // Puedes cambiar el nombre según tus preferencias
        });
      };
  
    return Reserva;
  };
  