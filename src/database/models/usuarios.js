// modelos/Usuarios.js
module.exports = function (sequelize, dataTypes) {
  let alias = "Usuarios";
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
    email: {
      type: dataTypes.STRING(500),
      allowNull: false,
    },
    contraseña: {
      type: dataTypes.STRING(500),
      allowNull: false,
    },
    admin: {
      type: dataTypes.STRING(500),
      allowNull: false,
    },
  };
  let config = {
    tableName: "Usuarios",
    timestamps: false,
  };

  const Usuarios = sequelize.define(alias, cols, config);

  // Relación N:N con Departamentos
  Usuarios.belongsToMany(sequelize.models.Departamento, {
    through: "UsuarioDepartamento",
    foreignKey: "usuarioId",
    as: "departamentos",
  });

  return Usuarios;
};
