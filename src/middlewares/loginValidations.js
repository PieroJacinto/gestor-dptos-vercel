const { body } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../models/User")
const validations = [
    body("email")
        .notEmpty()
        .withMessage("Debes brindar un email")
        .custom(async (value, { req }) => {
            const userToLogin = User.findByField("email", req.body.email)
            if (!userToLogin) {
              throw new Error("El usuario no está registrado");
            }
          }),     
    body("password")
        .notEmpty()
        .withMessage("debes introducir una contrseña")
        .custom(async (value, { req,res }) => {
            const userToLogin = User.findByField("email", req.body.email);
            if (userToLogin) {
              const password = userToLogin.password;
              let passwordOk = bcryptjs.compareSync(req.body.password, password);
              if (!passwordOk) {
                throw new Error("La contraseña es incorrecta");
              }              
            }
          }),   
]

module.exports = validations;
