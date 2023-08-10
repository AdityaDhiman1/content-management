const Post = require('../models/postmodel')
const Setting = require('../models/settingmodal')
const { ObjectId } = require('mongodb')
const config = require('../config/config')
const nodemailer = require('nodemailer')

const senCommentMail = async (name, email, post_id) => {
    try {
       let transport =  nodemailer.createTransport({
            host: "smpts.gmail.com",
            port: 587,
            secure: true,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
       });
        let mailOptions = {
            from: "BMS",
            to: email,
            subject: "new reply",
            html:`<p>+ ${name} + , has replied on your comment  <a href="http://127.0.0.1:3000/post/"+${post_id}+"> 'Read here </a> </p>`

        }
        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err.message);
            }
            else{
                console.log('email sent successfully',info)
                }
        })
    } catch (error) {
        console.error(error.message)
        
    }
}

const loadContent = async (req, res) => {
    try {

        let setting = await Setting.findOne({});
        let limit = setting.post_limit;
        let posts = await Post.find({}).limit(limit)
        res.render('content', { posts: posts,post_limit: limit})
    } catch (error) {
        console.log(error.message);

    }
}

const loadpost = async (req, res) => {
    try {
        const post = await Post.findOne({ "_id": req.params.id });
        res.render('post', { post: post })
    } catch (error) {
        console.log(error.message);

    }
}


const addcomment = async (req, res) => {
    try {
        let post_id = req.body.post_id;
        let username = req.body.username;
        let email = req.body.email;
        let comment = req.body.comment;
        let comment_id = new ObjectId();

        await Post.findByIdAndUpdate({ _id: post_id, }, {
            $push: {
                "comments": { _id: comment_id, email: email, username: username, comment: comment }
            }
        })
        res.status(200).send({ success: true, message: "Comment added",_id: comment_id});

    } catch (error) {
        res.status(200).send({ success: false, message: error.message });
        console.log("addcomment me errore", error.message);

    }
}

const doreply = async (req, res) => {
    try {

        var reply_id = new ObjectId();
       await Post.updateOne({
            "_id": new ObjectId(req.body.post_id),
            "comments._id": new ObjectId(req.body.comment_id),
        }, {
            $push: {
                "comments.$.replies": { _id:reply_id, name:req.body.name, reply:req.body.reply }
            }
       });
        
       senCommentMail(req.body.name, req.body.comment_email,req.body.post_id)
       
        res.status(200).send({ success: true, message: "Reply added" ,_id:reply_id});
    } catch (error) {
        res.status(200).send({ success: false, message: error.message });
    }
}

const getPosts = async (req, res) => {
    try {
        let limit = parseInt(req.params.limit);
        let skip = parseInt(req.params.start); 
        
        let posts = await Post.find({}).skip(skip).limit(limit);
        
        res.send(posts);
    } catch (error) {
        res.status(500).send({ success: false, message: "An error occurred." });
        console.error("Error in getPosts:", error.message);
    }
}

module.exports = {
    loadContent,
    loadpost,
    addcomment,
    doreply,
    getPosts
}