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