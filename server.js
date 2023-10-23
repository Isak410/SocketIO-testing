const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const session = require('express-session')
var usercount = 0
var usersCurrentlyConnected = 0
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
        usersCurrentlyConnected--
        if (usersCurrentlyConnected < 0) {usersCurrentlyConnected = 0}
        console.log(`user ${currentUserId} disconnected`);
        io.emit('user_disconnect', users[currentUserId]);
        io.emit('display_usersconnected', usersCurrentlyConnected)
        delete users[currentUserId];
    });

    socket.on('newUser', (userInfo) => {
        usersCurrentlyConnected++
        users[currentUserId] = userInfo[1];
        io.emit('userhasconnected', users[currentUserId])
        io.emit('display_usersconnected', usersCurrentlyConnected)
    });

    socket.on('chat message', (msg) => {
        console.log("Message: "+msg);
        console.log(msg.senderID);
        msg.user = users[msg.senderID];
        console.log(msg.timeOfSend);
        var sendTimeArr = [msg.timeOfSend[0]+msg.timeOfSend[1],msg.timeOfSend[3]+msg.timeOfSend[4]]
        msg.timeOfSend = sendTimeArr
        io.emit('chat message', msg);
    });
});


app.use(express.static('public'));

server.listen(8080, () => {
    console.log('Listening on 8080');
});

setTimeout(()=> {
    io.emit('reload_page')}
 ,100);

