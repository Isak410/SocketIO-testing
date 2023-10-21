const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var usercount = 0
var users = {}


const {
    Server
} = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('assinguserid', usercount)
    usercount++
    socket.on('disconnect', function () {
      console.log("user disconnected")
    });
    socket.on('newUser', (userInfo) => {
      users[userInfo[0]] = userInfo[1]
      console.log("USERS:")
      console.log(users)
      console.log("userinfo: "+userInfo[0]+userInfo[1])
    })
    socket.on('chat message', (msg) => {
      console.log(`Message: ${msg.message}`);
      console.log(msg.senderID)
      msg.user = users[msg.senderID]
      console.log(msg.timeOfSend)
      io.emit('chat message', msg);
    });
});


app.use(express.static('public'));

server.listen(8080, () => {
    console.log('Listining on 8080');
});