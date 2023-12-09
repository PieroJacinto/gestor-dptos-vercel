// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

const guestMiddleware = require("../middlewares/guestMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")
// requerimos validaciones
const loginValidations = require("../middlewares/loginValidations")
const registerValidations = require("../middlewares/registerValidations")
// REQUERIMOS EL MAIN CONTROLLER
const authControllers = require("../controllers/auth-controllers");

// HOME
router.get("/login",guestMiddleware, authControllers.login)
router.post("/login", loginValidations, authControllers.processLogin)

router.get("/register",guestMiddleware, authControllers.register)
router.post("/register", registerValidations, authControllers.processRegister)

router.get("/profile",authMiddleware, authControllers.profile)
router.get("/logout", authControllers.logout)


//EXPORTAMOS ROUTER
module.exports = router;