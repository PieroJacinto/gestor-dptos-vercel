// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

// requerimos validaciones
const reserveValidations = require("../middlewares/reserveValidation")

// REQUERIMOS EL MAIN CONTROLLER
const mainControllers = require("../controllers/main-controllers");

// HOME
router.get("/", mainControllers.home);
router.get("/nueva", mainControllers.nuevaReserva)
router.post("/nueva", reserveValidations, mainControllers.agregarDpto);

router.get("/detalle/:id", mainControllers.detalle)

// Nuevas rutas para la edición
router.get("/editar/:id", mainControllers.editarVista);
router.put("/editar/:id", mainControllers.editarReserva);
router.delete("/eliminar/:id", mainControllers.destroy);

// Agrega una nueva ruta para manejar las reservas por departamento
router.get("/calendario/:departamento", mainControllers.calendario);

// Agrega una nueva ruta para manejar la facturación mensual por departamento
router.get("/facturacion/:departamento", mainControllers.facturacion);

router.get("/agregar/gastos", mainControllers.gastos)
router.post("/agregar/gastos", mainControllers.agregarGastos)

router.get("/ver/gastos", mainControllers.verGastos)

router.get("/gasto/:id/update", mainControllers.updateGastoVista)
router.put("/gasto/:id/update", mainControllers.updateGasto)

router.delete("/gasto/:id/delete", mainControllers.deleteGasto)

router.get("/all/gastos", mainControllers.allGastos)



//EXPORTAMOS ROUTER
module.exports = router;