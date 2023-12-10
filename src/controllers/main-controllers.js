const fs = require("fs");
const path = require("path");

const {validationResult } = require("express-validator");
const db = require("../database/models");

const Gasto = require("../models/Gasto")
const {
  index,
  one,
  obtenerDepartamento,
  obtenerReserva,
  agregarNuevoDepartamento,
} = require("../models/reservas.model");
module.exports = {
  home: async (req, res) => {    
    res.render("home");
  },
  nuevaReserva: async (req, res) => {
    res.render("nuevaReserva");
  },
  agregarDpto : async (req, res) => {
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
    const reservaId = parseInt(req.params.id);
    const reserva = one(reservaId);

    if (!reserva) {
      // Manejar el caso en que la reserva no se encuentre
      res.status(404).send("Reserva no encontrada");
      return;
    }

    res.render("editarReserva", { reserva });
  },

  editarReserva: async (req, res) => {
    const reservaId = parseInt(req.params.id);

    try {
      // Obtén todas las reservas
      const reservasAll = index();
      // Encuentra la reserva específica por ID
      const reservaExistente = reservasAll.find(
        (reserva) => reserva.id === reservaId
      );
      if (!reservaExistente) {
        res.status(404).send("Reserva no encontrada");
        return;
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
      // Validación de fechas
      const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ""}`);
      const fechaCheckOutObj = new Date(
        `${fechaCheckOut} ${horaCheckOut || ""}`
      );
      if (fechaCheckOutObj <= fechaCheckInObj) {
        // Manejar el caso en que la fecha de Check-Out es anterior o igual a la de Check-In
        res
          .status(400)
          .send("La fecha de Check-Out debe ser posterior a la de Check-In");
        return;
      }
      // Calcula la cantidad de días redondeando siempre hacia arriba
      const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
      const cantidadDias = Math.ceil(
        diffEnMilisegundos / (1000 * 60 * 60 * 24)
      );
      // Calcula el precio total antes de aplicar la señal
      const precioTotal = cantidadDias * parseFloat(precioPorDia);
      // Calcula el monto de la seña pagada por los huéspedes
      const seniaPagada = senia !== "" ? parseInt(senia) : 0;
      // Actualiza la reserva existente con los nuevos datos
      Object.assign(reservaExistente, {
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
      });
      // Guarda la reserva actualizada
      const productoActualizado = JSON.stringify(reservasAll, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../data/reservas.json"),
        productoActualizado
      );

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
    reserva = db.Reserva.findByPk(id);
    res.render("detalleReserva", { reserva });
  },
  destroy: async (req, res) => {
    console.log("estoy en destroy");  
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
      console.log("departamento: ", JSON.stringify(departamento,null,4))
      if (!departamento) {
        return res.status(400).send('El departamento especificado no existe');
      }
  
      // Obtener todas las reservas del departamento
      const reservas = await db.Reserva.findAll({
        where: { departamentoId: departamento.id },
      });
      console.log("reservas: ", JSON.stringify(reservas,null,4))
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
  gastos: async ( req, res ) => {
    res.render("gastos")
  },
  agregarGastos: async ( req, res ) => {
    const gasto = req.body
    Gasto.agregarNuevoGasto(gasto)
    res.redirect("/");    
  },
  verGastos: async (req, res) => {
    const userDepartamento = req.session.userLogged.departamento;
    const userYear = req.query.year || new Date().getFullYear().toString();
    const userMonth = req.query.month || (new Date().getMonth() + 1).toString();

    // Filtrar gastos por departamento, año y mes
    const filteredGastos = Gasto.index().filter(gasto =>
      gasto.departamento === userDepartamento &&
      gasto.year === userYear &&
      gasto.month === userMonth
    );

    res.render("verGastos", { userDepartamento, gastos: filteredGastos, userYear, userMonth });
  },
  allGastos: async (req, res) => {
    const userYear = req.query.year || new Date().getFullYear().toString();
    const userMonth = req.query.month || (new Date().getMonth() + 1).toString();
    let userDepartment = req.query.department || "Mansilla"; // Valor por defecto
  
    // Asegúrate de que userDepartment tenga un valor válido
    const departamentosValidos = ["Mansilla", "Corrientes", "Las-Heras"];
    if (!departamentosValidos.includes(userDepartment)) {
      userDepartment = "Mansilla"; // O cualquier valor predeterminado que desees
    }
  
    // Filtrar gastos por año, mes y departamento
    const filteredGastos = Gasto.index().filter(gasto =>
      gasto.year === userYear &&
      gasto.month === userMonth &&
      gasto.departamento === userDepartment
    );
  
    res.render("allGastos", { gastos: filteredGastos, userYear, userMonth, userDepartment });
  },
  updateGastoVista: async (req, res) => {
    try {
      const gasto = await Gasto.findByPk(req.params.id);
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
        // Obtén todos los gastos
        const allGastos = Gasto.index();

        // Encuentra el índice del gasto a actualizar
        const indexToUpdate = allGastos.findIndex((gasto) => gasto.id === gastoId);

        if (indexToUpdate === -1) {
            res.status(404).send("Gasto no encontrado");
            return;
        }

        // Actualiza el gasto existente con los nuevos datos del cuerpo de la solicitud
        allGastos[indexToUpdate] = {
            ...allGastos[indexToUpdate],
            ...req.body,
            id: gastoId, // Aseguramos que el ID no se modifique
        };

        // Guarda la lista de gastos actualizada
        fs.writeFileSync(
            path.resolve(__dirname, "../data/gastos.json"),
            JSON.stringify(allGastos, null, 2)
        );
        req.session.userLogged.admin === "full-admin" ? res.redirect("/all/gastos") : res.redirect("/ver/gastos")
    } catch (error) {
        console.error("Error al editar el gasto:", error.message);
        res.status(500).send("Error interno al editar el gasto");
    }
},

deleteGasto: (req, res) => {
  try {
      const gastos = Gasto.index();
      const id = req.params.id;

      // Filtrar el gasto a eliminar
      const gastoAEliminar = gastos.find((gasto) => gasto.id == id);

      if (!gastoAEliminar) {
          return res.status(404).send('Gasto no encontrado');
      }

      // Filtrar los gastos restantes
      const gastosRestantes = gastos.filter((gasto) => gasto.id != id);

      // Guardar los gastos restantes
      const gastosGuardar = JSON.stringify(gastosRestantes, null, 2);
      fs.writeFileSync(
          path.resolve(__dirname, "../data/gastos.json"),
          gastosGuardar
      );

      req.session.userLogged.admin === "full-admin" ? res.redirect("/all/gastos") : res.redirect("/ver/gastos")
  } catch (error) {
      console.error("Error al eliminar el gasto:", error.message);
      res.status(500).send("Error interno al eliminar el gasto");
  }
}

};
