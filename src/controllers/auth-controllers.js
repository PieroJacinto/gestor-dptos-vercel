const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../database/models");


module.exports = {
    login: async (req, res) => {
        res.render("login");

    },
    processLogin: async (req, res) => {
        const resultValidation = validationResult(req);
        console.log("body: ", req.body)
        console.log("result valid",resultValidation)
        if (resultValidation.errors.length > 0) {
            return res.render("login", {
                errors: resultValidation.mapped(),
                oldData: req.body,
            });
        }
        
        console.log("estoy en login proces")
        try {
            const userToLogin = await db.Usuarios.findOne({
                where: {
                    email: req.body.email,
                },
            });

            console.log("User to login:", userToLogin);

            if (!userToLogin) {
                throw new Error("El usuario no está registrado");
            }

            const passwordOk = await bcryptjs.compare(req.body.password, userToLogin.dataValues.contraseña);

            if (!passwordOk) {
                throw new Error("La contraseña es incorrecta");
            }
    
            // Eliminamos la contraseña antes de almacenar el usuario en la sesión
            delete userToLogin.password;
    
            req.session.userLogged = userToLogin;
    
            return res.redirect("/users/profile");
        } catch (error) {
            console.error("Error durante el proceso de inicio de sesión:", error);

            return res.render("login", {
                errors: {
                    general: {
                        msg: "Error durante el inicio de sesión. Por favor, inténtalo de nuevo.",
                        details: error.message,
                    },
                },
                oldData: req.body,
            });
        }
    },
    

    register: async (req, res) => {
        res.render("register");
    },
    processRegister: async (req, res) => {
        const resultValidation = validationResult(req);
    
        if (resultValidation.errors.length > 0) {
            return res.render("register", {
                errors: resultValidation.mapped(),
                oldData: req.body,
            });
        }    
        const userInDb = await db.Usuarios.findOne({
            where: {
                email: req.body.email,
            },
        });    
        console.log("body",req.body)
    
        if (userInDb) {
            return res.render("register", {
                errors: {
                    email: {
                        msg: "Este email ya está registrado",
                    },
                },
                oldData: req.body,
            });
        } else if (resultValidation.errors.length == 0) {
            await db.Usuarios.create({
                ...req.body,
                contraseña: bcryptjs.hashSync(req.body.password, 10), // Asegúrate de incluir la contraseña
                admin: "full-admin"
            }).then(function () {
                res.redirect("/login");
            });
        }
    },
    
    profile: async (req, res) => {
        const user = req.session.userLogged        
        res.render("profile", { user })
    },
    logout: async (req, res) => {
        req.session = null

        return res.redirect("/");
    }
};
