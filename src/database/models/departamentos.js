module.exports = function (sequelize, dataTypes) {
  let alias = "Departamento";
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
  };
  let config = {
    tableName: "Departamentos",
    timestamps: false,
  };

  const Departamento = sequelize.define(alias, cols, config);
  // Relación "has many" con Gasto

  Departamento.associate = (models) => {
    Departamento.hasMany(models.Reserva, {
      as: "reservas",
      foreignKey: "departamentoId",
    });
  
    Departamento.hasMany(models.Gasto, {
      as: "gastos",
      foreignKey: "departamentoId",
    });
  
    Departamento.hasMany(models.Usuarios, {
      as: "usuarios",
      foreignKey: "departamentoId",
    });
  };

  // Relación "has many" con Usuarios
  Departamento.associate = (models) => {
    Departamento.hasMany(models.Usuarios, {
      as: "Usuarios",
      foreignKey: "departamentoId",
    });
  };


  return Departamento;
};
