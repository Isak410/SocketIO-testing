const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var usercount = 0
var users = {}

const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.json())

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('assinguserid', usercount)
    const currentUserId = usercount;
    usercount++;

    socket.on('disconnect', function () {
        console.log(`user ${currentUserId} disconnected`);
        io.emit('user_disconnect', users[currentUserId]);
        delete users[currentUserId];
    });

    socket.on('newUser', (userInfo) => {
        users[currentUserId] = userInfo[1];
        io.emit('userhasconnected', users[currentUserId])
    });

    socket.on('chat message', (msg) => {
        console.log("Message: "+msg);
        console.log(msg.senderID);
        msg.user = users[msg.senderID];
        console.log(msg.timeOfSend);
        io.emit('chat message', msg);
    });
});


app.use(express.static('public'));

server.listen(8080, () => {
    console.log('Listening on 8080');
});