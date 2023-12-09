const { body } = require("express-validator");
const validations = [
    body("nombre")
        .notEmpty()
        .withMessage("Debes completar el nombre de la reserva")
        .bail()
        .isLength({ min: 2 })
        .withMessage("El nombre debe tener al menos dos caracteres"),
    body("telefono")
        .notEmpty()
        .withMessage("Debes incluir un telefono de contacto")
        .isLength({ min: 8 })
        .withMessage("El teléfono tener al menos 8 caracteres"),
    body("departamento")
        .notEmpty()
        .withMessage("Debes seleccionar un departamento")
        .isLength({ min: 1 })
        .withMessage("El departamento no puede ser un string vacío"),
    body("fechaCheckIn")
        .notEmpty()
        .withMessage("Debes proporcionar una fecha de check-in"),
    body("horaCheckIn"),
    body("fechaCheckOut")
        .notEmpty()
        .withMessage("Debes proporcionar una fecha de check-out"),
    body("horaCheckOut"),
    body("cantidadHuespedes")
        .notEmpty()
        .withMessage("Debes proporcionar una cantidad de huespedes"),
    body("moneda")
        .notEmpty()
        .withMessage("Debes proporcionar un tipo de moneda")
        .isLength({ min: 1 })
        .withMessage("La moneda no puede ser un string vacío"),
    body("precioPorDia")
        .notEmpty()
        .withMessage("Debes proporcionar un precio por dia"),
    body("senia")       
]

module.exports = validations;