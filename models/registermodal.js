const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Register',RegisterSchema)