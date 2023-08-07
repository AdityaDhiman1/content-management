const mongoose = require('mongoose');

const blogSettingSchema = mongoose.Schema({
    blag_title: {
        type: String,
        required: true,
    },
    bllog_logo: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('BlogSetting',blogSettingSchema)