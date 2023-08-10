const Register = require("../models/registermodal")

const isRegister = async (req, res, next) => {
    try {
        const register = await Register.find({})
        if (register.length == 0 && req.originalUrl != '/register') {
            res.redirect('/register')
        }
        else {
            next();
        }
    } catch (error) {
        console.log(error.message)

    }
}

module.exports = { isRegister}