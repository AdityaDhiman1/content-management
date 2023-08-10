const User = require('../models/usermodel')
const Register = require('../models/registermodal')
const Post = require('../models/postmodel')
const Setting = require('../models/settingmodal')
const bcrypt = require('bcrypt')

const securepassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);

    }
}

const loadRegister = async (req, res) => {
    try {
        let register = await Register.find({})
        if (register.length > 0) {
            res.redirect('/login')
        } else {
            res.render('register')
        }
    } catch (error) {
        console.log(error.message)
    }
};
    
const registerAdmin = async (req, res) => {
    try {
        let title = req.body.title
        let image = req.file.filename
        let description = req.body.description
        let email = req.body.email
        let name = req.body.name
        let password = await securepassword(req.body.password)

        let register = new Register({
            title: title,
            logo: image,
            description: description,
        })
        await register.save();

        let user = new User({
            name: name,
            email: email,
            password: password,
            is_admin: 1
        })
        let userData = await user.save();
        if (userData) {
            res.redirect('/login')
        } else {
            res.render('/register', { message: "Not Setup" })
        }


    } catch (error) {
        console.log("error Setupsave ",error.message)

    }
}

const dashboard = async (req, res) => {
    try {
        const allPosts = await Post.find({})
        res.render('admin/dashboard',{posts:allPosts})
    } catch (error) {
        console.log(error.message)

    }
}

const loadpost = (req, res) => {
    try {
        res.render("admin/postdashboard")
    } catch (error) {
        console.log(error.message)

    }
}

const addPost = async (req, res) => {
    try {

        let image = '';
        if (req.body.image !== undefined) {
            image = req.body.image;

        }
        let post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: image
        });
        let postData = await post.save();
        res.send({success:true,message:"Post added successfully",_id:postData._id})

    } catch (error) {
        res.send({success:false,message:error.message})
    }
}

const uploadimage = async (req, res) => {
    try {
        let imagePath = '/images';
        imagePath = imagePath + '/' + req.file.filename;
        res.send({ success: true, message: "Post image uploaded successfully", path: imagePath })

    } catch (error) {
        res.send({ success: false, message: error.message });

    }

}

const deletePost = async (req, res) => { 
    try {

        await Post.deleteOne({_id:req.body.id})
        res.status(200).send({success:true, message: "delete succefully" });

        
    } catch (error) {
        res.status(404).send({success:false, message: error.message });
        
    }
}

const loadEditpost = async (req, res) => { 

    try {
        
        let postdata = await Post.findOne({_id:req.params.id})
        res.render('admin/editpost',{post:postdata})
    } catch (error) {
        console.log(error.message);
        
    }
}
const updatePost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                image: req.body.image
            }
        });
        res.status(200).send({success:true, message: "post update successfully" });
        
    } catch (error) {

        res.status(404).send({success:false, message: error.message });
    }
}

const loadSetting = async(req,res)=> {
    try {
       let setting  = await Setting.findOne({})
        let postlimit = 0;
        if (setting != null) { 
            postlimit= setting.post_limit

        }
        res.render('admin/setting', { limit: postlimit });
        
    } catch (error) {
        console.log(error.message)
    }
    
}

const saveSetting = async (req, res) => {
    try {
        await Setting.updateOne({}, {
            post_limit: req.body.limit
        }, {
            upsert:true
        });
        res.status(200).send({ success: true, message: "Setting updated!" })
        
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}
module.exports = {
    loadRegister,
    registerAdmin,
    dashboard,
    loadpost,
    securepassword,
    addPost,
    uploadimage,
    deletePost,
    loadEditpost,
    updatePost,
    loadSetting,
    saveSetting,
}