const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../database/models");


const User = require("../models/User")

module.exports = {
    login: async (req, res) => {
        res.render("login");

    },
    processLogin: async (req, res) => {
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            return res.render("login", {
                errors: resultValidation.mapped(),
                oldData: req.body,
            });
        }
        const userToLogin = await db.Usuarios.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (userToLogin) {
            delete userToLogin.password
            req.session.userLogged = userToLogin;
        }
        return res.redirect("/users/profile")

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
        const userTocreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            admin: ""
        }
        const userInDb = await db.Usuarios.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (userInDb) {
            return res.render("register", {
                errors: {
                    email: {
                        msg: "Este email ya esta registrado",
                    },
                },
                oldData: req.body,
            });
        } else if (resultValidation.errors.length == 0) {
            await db.Usuarios.create({
                ...req.body,
                password: bcryptjs.hashSync(req.body.password, 10)
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
