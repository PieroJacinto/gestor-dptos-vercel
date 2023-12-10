// seeders/XXXXXX-usuario-departamento.js
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs de los departamentos
   // Obtener los IDs de los departamentos
const departamentos = await queryInterface.sequelize.query(
  'SELECT id FROM Departamentos;'
);


    const departamentoMansillaId = departamentos[0][0].id;
    const departamentoLasHerasId = departamentos[0][2].id;
    const departamentoCorrientesId = departamentos[0][1].id;

    // Asignar todos los departamentos al usuario 1
    await queryInterface.bulkInsert("UsuarioDepartamento", [
      {
        usuarioId: 1,
        departamentoId: departamentoMansillaId,
      },
      {
        usuarioId: 1,
        departamentoId: departamentoLasHerasId,
      },
      {
        usuarioId: 1,
        departamentoId: departamentoCorrientesId,
      },
      // Asignar departamentos a los otros usuarios
      {
        usuarioId: 2,
        departamentoId: departamentoCorrientesId,
      },
      {
        usuarioId: 3,
        departamentoId: departamentoLasHerasId,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar las asignaciones de usuarios a departamentos
    await queryInterface.bulkDelete("UsuarioDepartamento", null, {});
  },
};
