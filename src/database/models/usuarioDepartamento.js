// modelos/UsuarioDepartamento.js
module.exports = function (sequelize, DataTypes) {
  let alias = "UsuarioDepartamento";
  let cols = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };
  let config = {
    tableName: "UsuarioDepartamento",
    timestamps: false,
  };

  const UsuarioDepartamento = sequelize.define(alias, cols, config);

  // Relaciones
  UsuarioDepartamento.associate = (models) => {
    // Cambia el nombre del modelo en la relación con Usuarios
    UsuarioDepartamento.belongsTo(models.Usuarios, {
      foreignKey: "usuarioId",
      as: "usuario",
      targetKey: "id",
    });

    // Cambia el nombre del modelo en la relación con Departamentos
    UsuarioDepartamento.belongsTo(models.Departamento, {
      foreignKey: "departamentoId",
      as: "departamento",
      targetKey: "id",
    });
  };

  return UsuarioDepartamento;
};
