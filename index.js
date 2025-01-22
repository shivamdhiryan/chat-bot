const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();
const server = http.createServer(app);


const PORT = process.env.PORT || 4999

const io = new Server(server);
app.use(express.static(path.join(__dirname,'public')))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
const users = {};
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new-user-joined', (name) => {
        console.log('print', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});

server.listen(PORT, () => {
    console.log('server running at http://localhost:4999');
});
