const express = require('express');
const content_route = express();
const contencontroller = require('../controllers/contentcontroller')
content_route.set('view engine', 'ejs');
content_route.set('views','./views');
content_route.use(express.static('public'))




content_route.get('/',contencontroller.loadContent)
content_route.get('/post/:id',contencontroller.loadpost)
content_route.post('/add-comment',contencontroller.addcomment)
content_route.post('/do-reply', contencontroller.doreply)
content_route.get('/get-posts/:start/:limit', contencontroller.getPosts)
module.exports = content_route