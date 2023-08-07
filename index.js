const  mongoose = require('mongoose');
const  express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io')
const io = new Server(server, {});
const path = require('path');
const PORT = process.env.PORT || 3000;
const admin_route = require('./routes/adminRoutes')
const user_route = require('./routes/userroute')
const blog_route = require('./routes/blogroute')
mongoose.connect("mongodb://127.0.0.1:27017/BMS").then(() => {
    console.log('connection established')
}).catch((err) => {
    console.log('error connecting',err.message)
})
const isBlog = require('./middleware/isBlog')
// app.use(express.static(path.join(__dirname + '/public')));
io.on('connection', function (socket) {
    socket.on("new_post", function (formData) {
        socket.broadcast.emit("new_post", formData);
    })

    socket.on("new_comment", function (comment) { 
        io.emit("new_comment", comment);

    })
    socket.on("new_reply", function (reply) { 
        io.emit("new_reply", reply);    
    })

    socket.on("delete_post", function (postID) { 
        socket.broadcast.emit('delete_post', postID);
    })
})

app.use(isBlog.isBlog)

app.use('/',admin_route)
app.use('/',user_route)
app.use('/',blog_route)



server.listen(PORT, () => {
    console.log('listening on port',PORT)
})

