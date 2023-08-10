const mongoose = require('mongoose');
require('dotenv').config()
const  express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io')
const io = new Server(server, {});
const path = require('path');
const PORT = process.env.PORT || 3000;
const admin_route = require('./routes/adminRoutes')
const user_route = require('./routes/userroute')
const content_route = require('./routes/contentroute')
const isRegister = require('./middleware/isregister');
const connectDB = require('./DB/connection');
app.use(isRegister.isRegister)

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

app.use('/',admin_route)
app.use('/',user_route)
app.use('/',content_route)


const start = async () => { 
    try {
        server.listen(PORT, () => {
            console.log(`listening on port ${PORT}`)
        })
        await connectDB(process.env.MONGODB_URL);
    } catch (error) {
        console.error(error.message)
        
    }
}

start();


