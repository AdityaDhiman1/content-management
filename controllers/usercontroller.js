const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const nodeemailer = require('nodemailer');
const randomstring = require("randomstring");
const config = require('../config/config')
const adminControler = require('../controllers/admincontroller')
const sendResetPassmail = async (name, email, token) => {
    try {
        const transport = nodeemailer.createTransport({
            host: 'smtp.gmail.com',
            sendMail:true,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
              },
        })
        const mailOption = {
            from: config.emailUser,
            to: email,
            subject: "Reset Password",
            html:  `<p> Hi ${name},</p><p>Please click the link below to reset your password:</p><a href="http://127.0.0.1:3000/reset-password?token=${token}">Reset Password</a>`
        }
        transport.sendMail(mailOption, (error, info) => {
            console.log(info)
            if (error) {
                console.log("error sendMail",error.message)
            } else {
                console.log("Email sent successfully", info.response)
            }

        })
    } catch (error) {
        console.log(error.message)
    }
}
const loadlogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {

    }
}

const verifylogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password

        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordmatch = await bcrypt.compare(password, userData.password)
            if (passwordmatch) {
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                if (userData.is_admin == 1) {
                    res.redirect('/dashboard')

                } else {
                    res.redirect('/profile')
                }

            } else {
                res.render('login', { message: 'email and password are incorrect' })
            }

        } else {
            res.render('login', { message: 'email and password are incorrect' })
        }
    } catch (error) {
        console.log(error.message);

    }
}

const profile = async (req, res) => {
    try {
        res.send('profile')
    } catch (error) {
        console.log(error.message)

    }
}
const forgetLoad = (req, res) => {
    try {
        res.render('forget-password');

    } catch (error) {
        console.log(error.message)

    }
}

const logout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message)

    }
}

const forgetpasswrodverify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {

            const randomString = randomstring.generate();

            await User.updateOne({ email: email }, { $set: { token: randomString } })
            sendResetPassmail(userData.name, userData.email, randomString);
            res.render('forget-password', { message: "Please check your email" })

        } else {
            res.render('forget-password', { message: "User email is incorrect! " })
        }

    } catch (error) {
        console.log(error.message)

    }
}

const resetpassload = async(req, res) => { 
    try {
        const token = req.query.token;
        const takendata = await User.findOne({ token:token})
        if (takendata) {
            res.render('reset-password',{user_id:takendata._id})
        } else {
            res.render('404')
        }


        
    } catch (error) {
        console.log(error.message)
    }
}

const resetpass = async (req, res) => { 
    try {
        const password = req.body.password
        const user_id = req.body.user_id
        const securepass = await adminControler.securepassword(password)
        User.findByIdAndUpdate({_id:user_id},{$set:{password:securepass,token:''}})
        res.redirect('/login')
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports = {
    loadlogin,
    verifylogin,
    profile,
    logout,
    forgetLoad,
    forgetpasswrodverify,
    resetpassload,
    resetpass
}