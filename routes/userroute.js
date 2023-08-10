const express = require('express');
const user_route = express();
require('dotenv').config()
const bodyParser = require('body-parser')
const path = require('path')
const session =require('express-session')
user_route.use(bodyParser.json())
const adminLoginAuth = require('../middleware/adminLoginAuth')
user_route.use(bodyParser.urlencoded({ extended: true }))

const usercontroller = require('../controllers/usercontroller')
user_route.set('view engine', 'ejs')
user_route.set('views', './views');
user_route.use(express.static('public'))



user_route.use(session({
    secret: process.env.sessionsecret,
    resave: true,
    saveUninitialized:true
}));

user_route.get('/login',  adminLoginAuth.isLogout, usercontroller.loadlogin)
user_route.post('/login',usercontroller.verifylogin)
user_route.get('/profile',usercontroller.profile)
user_route.get('/forget-password',adminLoginAuth.isLogout, usercontroller.forgetLoad)
user_route.post('/forget-password', usercontroller.forgetpasswrodverify)

user_route.get('/logout',  adminLoginAuth.isLogin, usercontroller.logout)
user_route.get('/reset-password', adminLoginAuth.isLogout, usercontroller.resetpassload)
user_route.post('/reset-password', usercontroller.resetpass)


module.exports = user_route;