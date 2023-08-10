const express = require('express');
const admin_route = express();
const admincontroller = require("../controllers/admincontroller")
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const ejs = require('ejs')
const session = require('express-session')
require('dotenv').config()
const adminLoginAuth = require('../middleware/adminLoginAuth')

admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({ extended: true }))

admin_route.set('view engine', 'ejs')
admin_route.set('views', './views');
admin_route.use(express.static('public'))


admin_route.use(session({
    secret: process.env.sessionsecret,
    resave: true,
    saveUninitialized:true
}));

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
       cb(null,path.join(__dirname,'../public/images')) 
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name)
    }
})
const upload = multer({ storage: storage })

admin_route.get('/register', admincontroller.loadRegister)
admin_route.post('/register', upload.single('image'), admincontroller.registerAdmin)
admin_route.get('/dashboard', adminLoginAuth.isLogin,   admincontroller.dashboard)
admin_route.get('/create-post',adminLoginAuth.isLogin, admincontroller.loadpost)
admin_route.post('/create-post',adminLoginAuth.isLogin, admincontroller.addPost)
admin_route.post('/delete-post',adminLoginAuth.isLogin, admincontroller.deletePost)
admin_route.post('/upload-post-image',  upload.single('image'),adminLoginAuth.isLogin, admincontroller.uploadimage)
admin_route.get('/edit-post/:id',adminLoginAuth.isLogin, admincontroller.loadEditpost)
admin_route.post('/update-post',adminLoginAuth.isLogin, admincontroller.updatePost)
admin_route.get('/settings',adminLoginAuth.isLogin, admincontroller.loadSetting)
admin_route.post('/settings',adminLoginAuth.isLogin, admincontroller.saveSetting)



module.exports = admin_route;