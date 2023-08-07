const BlogSetting = require('../models/blogSettingModel')
const User = require('../models/usermodel')
const Post = require('../models/postmodel')
const bcrypt = require('bcrypt')

const securepassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);

    }
}
const login = async (reqq, res) => {
    res.send("login")
}

const blogSetup = async (req, res) => {
    try {
        var blogsetting = await BlogSetting.find({})
        if (blogsetting.length > 0) {
            res.redirect('/login')
        } else {
            res.render('blogSetup')
        }
    } catch (error) {
        console.log(error.message)

    }
}
const blogSetupsave = async (req, res) => {
    try {
        const blag_title = req.body.blog_title
        const blog_image = req.file.filename
        const description = req.body.description
        const email = req.body.email
        const name = req.body.name
        const password = await securepassword(req.body.password)

        const blogsetting = new BlogSetting({
            blag_title: blag_title,
            bllog_logo: blog_image,
            description: description,
        })
        await blogsetting.save();

        const user = new User({
            name: name,
            email: email,
            password: password,
            is_admin: 1
        })
        const userData = await user.save();
        if (userData) {
            res.redirect('/login')
        } else {
            res.render('/blogSetup', { message: "Blog not setup" })
        }

    } catch (error) {
        console.log(error.message)

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

        var image = '';
        if (req.body.image !== undefined) {
            image = req.body.image;

        }
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: image
        });
        const postData = await post.save();
        res.send({success:true,message:"Post added successfully",_id:postData._id})

    } catch (error) {
        res.send({success:false,message:error.message})

    }
}

const uploadimage = async (req, res) => {
    try {
        var imagePath = '/images';
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

module.exports = {
    login,
    blogSetup,
    blogSetupsave,
    dashboard,
    loadpost,
    securepassword,
    addPost,
    uploadimage,
    deletePost,
    loadEditpost,
    updatePost,
}