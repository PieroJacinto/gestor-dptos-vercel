const { body } = require("express-validator");

const validations = [
    body("email")
        .notEmpty()
        .withMessage("Debes brindar un email"),        
    body("password")
    .notEmpty()
    .withMessage("debes introducir una contrseña")    
]

module.exports = validations;