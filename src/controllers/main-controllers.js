const { validationResult } = require("express-validator");
const db = require("../database/models");

module.exports = {
  home: async (req, res) => {
    res.render("home");
  },
  nuevaReserva: async (req, res) => {
    res.render("nuevaReserva");
  },
  agregarDpto: async (req, res) => {
    const resultValidation = validationResult(req);
    if (resultValidation.errors.length > 0) {
      return res.render("nuevaReserva", {
        errors: resultValidation.mapped(),
        oldData: req.body
      });
    }
    const {
      nombre,
      telefono,
      departamento,
      fechaCheckIn,
      horaCheckIn,
      fechaCheckOut,
      horaCheckOut,
      cantidadHuespedes,
      moneda,
      precioPorDia,
      senia,
    } = req.body;

    // Validación de fechas
    const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ""}`);
    const fechaCheckOutObj = new Date(`${fechaCheckOut} ${horaCheckOut || ""}`);

    if (fechaCheckOutObj <= fechaCheckInObj) {
      res.status(400).send("La fecha de Check-Out debe ser posterior a la de Check-In");
      return;
    }

    // Calcula la cantidad de días redondeando siempre hacia arriba
    const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
    const cantidadDias = Math.ceil(diffEnMilisegundos / (1000 * 60 * 60 * 24));

    // Calcula el precio total antes de aplicar la señal
    const precioTotal = cantidadDias * parseFloat(precioPorDia);

    // Calcula el monto de la seña pagada por los huéspedes
    const seniaPagada = senia !== "" ? parseInt(senia) : 0;

    // Obtiene el departamento correspondiente al nombre proporcionado
    const departamentoEncontrado = await db.Departamento.findOne({ where: { nombre: departamento } });

    if (!departamentoEncontrado) {
      // Maneja el caso en que el departamento no existe
      res.status(400).send('El departamento especificado no existe');
      return;
    }
    // Crea un objeto con los datos del formulario y el departamento asociado
    const nuevaReserva = {
      nombre,
      telefono,
      fechaCheckIn,
      horaCheckIn,
      fechaCheckOut,
      horaCheckOut,
      cantidadHuespedes: parseInt(cantidadHuespedes),
      moneda,
      precioPorDia: parseFloat(precioPorDia),
      senia: seniaPagada,
      total: precioTotal,
      restaPagar: precioTotal - seniaPagada,
      fechaReserva: new Date().toISOString().split("T")[0],
      cantidadDias,
      departamentoId: departamentoEncontrado.id, // Asociamos el departamento a la reserva
    };
    try {
      // Crea la reserva
      await db.Reserva.create(nuevaReserva);
      // Redirige después de agregar un nuevo departamento
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la reserva");
    }
  },
  editarVista: async (req, res) => {
    try {
      const reservaId = parseInt(req.params.id);
      const reserva = await db.Reserva.findByPk(reservaId);

      if (!reserva) {
        res.status(404).send("Reserva no encontrada");
        return;
      }

      // Obtener todos los departamentos
      const departamentos = await db.Departamento.findAll();
      const monedas = ["ARS", "USD"];
      res.render("editarReserva", { reserva, departamentos, monedas });
    } catch (error) {
      console.error("Error al obtener la reserva o departamentos:", error);
      res.status(500).send("Error interno del servidor");
    }
  },

  editarReserva: async (req, res) => {
    const reservaId = parseInt(req.params.id);

    try {
      // Encuentra la reserva específica por ID
      const reservaExistente = await db.Reserva.findByPk(reservaId);

      if (!reservaExistente) {
        res.status(404).send("Reserva no encontrada");
        return;
      }
      // Validación de fechas y otros campos
      const resultValidation = validationResult(req);
      if (!resultValidation.isEmpty()) {
        return res.render("editarReserva", {
          csrfToken: req.csrfToken(),
          errors: resultValidation.mapped(),
          oldData: req.body,
          reserva: reservaExistente,
        });
      }
      // Extrae los datos actualizados del cuerpo de la solicitud
      const {
        nombre,
        telefono,
        departamento,
        fechaCheckIn,
        horaCheckIn,
        fechaCheckOut,
        horaCheckOut,
        cantidadHuespedes,
        moneda,
        precioPorDia,
        senia,
      } = req.body;

      // Calcula la cantidad de días redondeando siempre hacia arriba
      const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ""}`);
      const fechaCheckOutObj = new Date(`${fechaCheckOut} ${horaCheckOut || ""}`);
      const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
      const cantidadDias = Math.ceil(diffEnMilisegundos / (1000 * 60 * 60 * 24));

      // Calcula el precio total antes de aplicar la señal
      const precioTotal = cantidadDias * parseFloat(precioPorDia);

      // Calcula el monto de la seña pagada por los huéspedes
      const seniaPagada = senia !== "" ? parseInt(senia) : 0;

      // Obtiene el departamento correspondiente al nombre proporcionado
      const departamentoEncontrado = await db.Departamento.findByPk(departamento);

      if (!departamentoEncontrado) {
        res.status(400).send('El departamento especificado no existe');
        return;
      }

      // Actualiza la reserva existente con los nuevos datos
      await reservaExistente.update({
        nombre,
        telefono,
        departamento,
        fechaCheckIn,
        horaCheckIn,
        fechaCheckOut,
        horaCheckOut,
        cantidadHuespedes: parseInt(cantidadHuespedes),
        moneda,
        precioPorDia: parseFloat(precioPorDia),
        senia: seniaPagada,
        total: precioTotal,
        restaPagar: precioTotal - seniaPagada,
        fechaReserva: new Date().toISOString().split("T")[0],
        cantidadDias,
        departamentoId: departamentoEncontrado.id,
        // Actualiza otros campos según sea necesario
      });

      // Redirecciona a la página de detalle de la reserva actualizada
      res.redirect(`/detalle/${reservaId}`);
    } catch (error) {
      console.error("Error al editar la reserva:", error.message);
      res.status(500).send("Error interno al editar la reserva");
    }
  },
  calendario: async (req, res) => {
    const nombreDepartamento = req.params.departamento;
    // Busca el departamento por nombre para obtener su ID
    const departamento = await db.Departamento.findOne({
      where: { nombre: nombreDepartamento },
    });
    if (!departamento) {
      // Maneja el caso en que el departamento no existe
      return res.status(400).send('El departamento especificado no existe');
    }
    // Obtén todas las reservas
    const reservas = await db.Reserva.findAll();
    // Filtra las reservas por departamentoId
    const eventosDepartamento = reservas
      .filter((reserva) => reserva.departamentoId === departamento.id)
      .map((reserva) => ({
        title: reserva.nombre,
        start: reserva.fechaCheckIn,
        end: reserva.fechaCheckOut,
        id: reserva.id,
      }));
    res.render("calendario", { eventosDepartamento, departamentoSeleccionado: nombreDepartamento });
  },
  detalle: async (req, res) => {
    id = parseInt(req.params.id);
    reserva = await db.Reserva.findByPk(id);
    res.render("detalleReserva", { reserva });
  },
  destroy: async (req, res) => {
    await db.Reserva.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/");
  },
  facturacion: async (req, res) => {
    try {
      const nombreDepartamento = req.params.departamento;
      const selectedMonth = req.query.month;
      const departamento = await db.Departamento.findOne({
        where: { nombre: nombreDepartamento },
      });
      console.log("departamento: ", JSON.stringify(departamento, null, 4))
      if (!departamento) {
        return res.status(400).send('El departamento especificado no existe');
      }
      // Obtener todas las reservas del departamento
      const reservas = await db.Reserva.findAll({
        where: { departamentoId: departamento.id },
      });
      console.log("reservas: ", JSON.stringify(reservas, null, 4))
      // Filtrar por año y mes (si se proporcionan en la consulta)
      const getMonthName = (month) => {
        const meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        return meses[month - 1];
      };
      const formatearFecha = (fecha) => {
        const opciones = { year: "numeric", month: "long", day: "numeric" };
        const fechaLocal = new Date(fecha + "T00:00:00Z"); // Asegura que la fecha se interprete en UTC
        const dia = fechaLocal.getUTCDate();
        const mes = fechaLocal.getUTCMonth() + 1;
        const anio = fechaLocal.getUTCFullYear();
        return `${dia} de ${getMonthName(mes)} de ${anio}`;
      };
      const { year, month } = req.query;
      const reservasFiltradas = reservas.filter((reserva) => {
        if (!year || !month) {
          return true; // No hay filtro, mostrar todas las reservas
        }
        const fechaCheckIn = new Date(`${reserva.fechaCheckIn}T00:00:00Z`);
        return (
          fechaCheckIn.getUTCFullYear() === parseInt(year) &&
          fechaCheckIn.getUTCMonth() === parseInt(month) - 1 &&
          fechaCheckIn.getUTCDate() >= 1
        );
      });
      // Calcular totales en pesos
      const reservasEnPesos = reservasFiltradas.filter(
        (reserva) => reserva.moneda === 'ARS'
      );
      const totalPesos = reservasEnPesos.reduce(
        (total, reserva) => total + reserva.total,
        0
      );
      // Calcular totales en dólares
      const reservasEnDolares = reservasFiltradas.filter(
        (reserva) => reserva.moneda === 'USD'
      );
      const totalDolares = reservasEnDolares.reduce(
        (total, reserva) => total + reserva.total,
        0
      );
      // Calcular Total Pagado en pesos y dólares
      const totalPagadoEnPesos = reservasEnPesos.reduce(
        (total, reserva) => total + reserva.senia,
        0
      );
      const totalPagadoEnDolares = reservasEnDolares.reduce(
        (total, reserva) => total + reserva.senia,
        0
      );
      // Calcular lo que resta pagar en pesos y dólares
      const restaPagarEnPesos = totalPesos - totalPagadoEnPesos;
      const restaPagarEnDolares = totalDolares - totalPagadoEnDolares;

      res.render('facturacion', {
        departamento: nombreDepartamento,
        reservas: reservasFiltradas,
        totalPesos,
        totalDolares,
        formatearFecha,
        selectedMonth,
        getMonthName,
        totalPagadoEnPesos,
        totalPagadoEnDolares,
        restaPagarEnPesos,
        restaPagarEnDolares,
      });
    } catch (error) {
      console.error('Error al obtener reservas para facturación:', error);
      res.status(500).send('Error interno del servidor');
    }
  },
  gastos: async (req, res) => {
    res.render("gastos")
  },
  agregarGastos: async (req, res) => {
    const gasto = req.body;
    // Verifica si el departamento existe
    const departamentoExistente = await db.Departamento.findOne({
      where: {
        nombre: gasto.departamento,
      },
    });
    if (!departamentoExistente) {
      return res.status(400).send("El departamento no es válido");
    }
    // Asigna el ID del departamento al gasto
    gasto.departamentoId = departamentoExistente.id;
    // Crea el gasto solo si el departamento es válido
    try {
      await db.Gasto.create(gasto);
      if (req.session.userLogged.admin == "full-admin") {
        res.redirect("/all/gastos");
      } else {
        res.redirect("/ver/gastos");
      }
    } catch (error) {
      console.error("Error al agregar gasto:", error.message);
      res.status(500).send("Error interno al agregar gasto");
    }
  },
  verGastos: async (req, res) => {
    try {
      // Obtener el ID del usuario desde la sesión
      const userId = req.session.userLogged.id;

      // Encontrar todas las asociaciones de UsuarioDepartamento para el usuario actual
      const userDepartments = await db.UsuarioDepartamento.findAll({
        where: {
          usuarioId: userId,
        },
        include: [{ model: db.Departamento, as: 'departamento' }],
      });

      // Asegúrate de que userDepartments tenga al menos un departamento
      if (userDepartments.length === 0) {
        return res.status(404).send("No se encontraron departamentos asociados al usuario");
      }

      const userYear = req.query.year || new Date().getFullYear().toString();
      const userMonth = req.query.month || (new Date().getMonth() + 1).toString();

      // Obtener los IDs de los departamentos asociados al usuario
      const departmentIds = userDepartments.map(dep => dep.departamento.id);

      // Filtrar gastos por departamentos, año y mes utilizando Sequelize
      const filteredGastos = await db.Gasto.findAll({
        where: {
          departamentoId: departmentIds,
          year: userYear,
          month: userMonth,
        },
        include: [{ model: db.Departamento, as: 'departamento' }],
      });

      res.render("verGastos", { gastos: filteredGastos, userYear, userMonth, userDepartments });
    } catch (error) {
      console.error("Error al buscar gastos:", error.message);
      // Manejar el error según sea necesario
      res.status(500).send("Error interno al buscar gastos");
    }
  },
  allGastos: async (req, res) => {
    const userYear = req.query.year || new Date().getFullYear().toString();
    const userMonth = req.query.month || (new Date().getMonth() + 1).toString();
    let userDepartment = req.query.department || "Mansilla"; // Valor por defecto
    try {
      // Obtener la lista de departamentos asociados al usuario (ajustar según tu modelo de Sequelize)
      const userDepartments = await db.UsuarioDepartamento.findAll({
        where: {
          usuarioId: req.session.userLogged.id,
        },
        include: [{ model: db.Departamento, as: 'departamento' }],
      });

      if (userDepartments.length === 0) {
        return res.status(404).send("No se encontraron departamentos asociados al usuario");
      }
      // Obtén los departamentoIds asociados al usuario
      const departamentoIds = userDepartments.map(dep => dep.departamentoId);
      // Filtrar gastos por departamentos, año y mes utilizando Sequelize
      let filteredGastos;
      if (req.query.department) {
        // Si se selecciona un departamento en el filtro, filtrar por ese departamento
        const selectedDepartment = await db.Departamento.findOne({
          where: {
            nombre: userDepartment,
          },
        });

        filteredGastos = await db.Gasto.findAll({
          where: {
            departamentoId: selectedDepartment.id, // Utilizar el ID del departamento seleccionado
            year: userYear,
            month: userMonth,
          },
          include: [{ model: db.Departamento, as: 'departamento' }],
        });
      } else {
        // Si no se selecciona un departamento en el filtro, cargar todos los gastos de "Mansilla"
        filteredGastos = await db.Gasto.findAll({
          where: {
            departamentoId: 1, // ID de "Mansilla"
            year: userYear,
            month: userMonth,
          },
          include: [{ model: db.Departamento, as: 'departamento' }],
        });
      }
      res.render("allGastos", { gastos: filteredGastos, userYear, userMonth, userDepartment });
    } catch (error) {
      console.error("Error al buscar gastos:", error.message);
      res.status(500).send("Error interno al buscar gastos");
    }
  },
  updateGastoVista: async (req, res) => {
    try {
      const gasto = await db.Gasto.findByPk(req.params.id);
      console.log("gasto to upd: ", gasto)
      if (!gasto) {
        return res.status(404).send('Gasto no encontrado VISTA');
      }
      res.render('actualizarGasto', { gasto }); // Reemplaza 'actualizarGasto' con el nombre de tu vista para actualizar gastos
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el gasto para actualizar');
    }
  },
  updateGasto: async (req, res) => {
    const gastoId = parseInt(req.params.id, 10);
    try {
      // Encuentra el gasto específico por ID
      const gastoExistente = await db.Gasto.findByPk(gastoId);
      if (!gastoExistente) {
        res.status(404).send("Gasto no encontrado");
        return;
      }
      // Actualiza el gasto existente con los nuevos datos del cuerpo de la solicitud
      await gastoExistente.update(req.body);
      // Redirige a la página correspondiente según el rol del usuario
      req.session.userLogged.admin === "full-admin"
        ? res.redirect("/all/gastos")
        : res.redirect("/ver/gastos");
    } catch (error) {
      console.error("Error al editar el gasto:", error.message);
      res.status(500).send("Error interno al editar el gasto");
    }
  },
  deleteGasto: async (req, res) => {
    try {
      await db.Gasto.destroy({
        where: {
          id: req.params.id,
        },
      });
      req.session.userLogged.admin === "full-admin" ? res.redirect("/all/gastos") : res.redirect("/ver/gastos");
    } catch (error) {
      console.error("Error al eliminar el gasto:", error.message);
      res.status(500).send("Error interno al eliminar el gasto");
    }
  },
};
