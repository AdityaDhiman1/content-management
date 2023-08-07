const express = require('express');
const blog_rout = express();
const blogcontroller = require('../controllers/blogcontroller')
blog_rout.set('view engine', 'ejs');
blog_rout.set('views','./views');
blog_rout.use(express.static('public'))



blog_rout.get('/',blogcontroller.loadBlog)
blog_rout.get('/post/:id',blogcontroller.loadpost)
blog_rout.post('/add-comment',blogcontroller.addcomment)
blog_rout.post('/do-reply', blogcontroller.doreply)
module.exports = blog_rout