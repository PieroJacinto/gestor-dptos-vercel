const { body } = require("express-validator");
const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const validations = [
    body("email")
        .notEmpty()
        .withMessage("Debes brindar un email")
        .custom(async (value, { req }) => {
            const userToLogin = await db.Usuarios.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!userToLogin) {
                throw new Error("El usuario no está registrado");
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Debes introducir una contraseña")
        .custom(async (value, { req }) => {
            const userToLogin = await db.Usuarios.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (userToLogin) {
                const passwordOk = await bcryptjs.compare(value, userToLogin.dataValues.contraseña);

                if (!passwordOk) {
                    throw new Error("La contraseña es incorrecta");
                }
            }
        }),
];

module.exports = validations;
