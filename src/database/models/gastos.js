module.exports = function (sequelize, dataTypes) {
    let alias = "Gasto";
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipoGasto: {
        type: dataTypes.STRING(50),
        allowNull: false,
      },
      precio: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: dataTypes.STRING(4),
        allowNull: false,
      },
      month: {
        type: dataTypes.STRING(2),
        allowNull: false,
      },
      // Puedes agregar más atributos según tus necesidades
    };
    let config = {
      tableName: "Gastos",
      timestamps: false,
    };
  
    const Gasto = sequelize.define(alias, cols, config);
  
    // Relación entre Gasto y Departamento
    Gasto.associate = (models) => {
        Gasto.belongsTo(models.Departamento, {
          foreignKey: "departamentoId",
          as: "departamento", // Puedes cambiar el nombre según tus preferencias
        });
    };
  
    return Gasto;
  };
  