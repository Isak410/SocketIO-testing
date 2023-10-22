
document.addEventListener('DOMContentLoaded', function () {
const formDiv = document.getElementById('formdiv')
const loginDiv = document.getElementById('logindiv')
const usernameButton = document.getElementById('usernamebutton')
const usernameInput = document.getElementById('usernameinput')
const messageDiv = document.getElementById('messages')
var myId = -1
console.log("script loaded")
    var socket = io();

    var form = document.getElementById('form');
    var input = document.getElementById('m');

    function submitUsername() {
      if (usernameInput.value != "") {
      formDiv.style.pointerEvents = "all"
      formDiv.style.opacity = "100%"
      loginDiv.style.pointerEvents = "none"
      loginDiv.style.opacity = "0%"
      socket.emit('newUser', [myId, usernameInput.value])
    }
  }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission behavior
      
      let tid = getTime()  
      let currentTime = (""+tid[0]+":"+tid[1]+":"+tid[2])
      socket.emit('chat message', {senderID: myId, timeOfSend:currentTime, message: input.value});
      input.value = '';
    });

    socket.on('assinguserid', function (userid) {
      if (myId == -1) {
        myId = userid
        console.log(myId)
      }
    })

 
    socket.on('chat message', function (msg) {
      if (msg.senderID != myId) {
      var audio = new Audio('../Assets/notif.mp3');
      audio.play();}
      var message1 = document.createElement('p');
      message1.textContent = (msg.timeOfSend + " - " + msg.user + " - " + msg.message);
      message1.id = msg.senderID
      console.log("my id: "+myId)
      if (message1.id == myId) {
        message1.className = "myMessage"
        message1.textContent = (msg.message + " - " + msg.timeOfSend)
        var br = document.createElement("br")
        var br1 = document.createElement("br")
        messageDiv.appendChild(message1);
        messageDiv.appendChild(br)
        messageDiv.appendChild(br1)
      } else {
        messageDiv.appendChild(message1)
      }
      
      
    });
    usernameButton.addEventListener('click', submitUsername)
  });

function getTime() {
  const dato = new Date()
  var time = dato.getHours()
  if (time < 10) {time = "0"+time}
  var minutter = dato.getMinutes()
  if (minutter < 10) {minutter = "0"+minutter}
  var sekunder = dato.getSeconds()
  if (sekunder < 10) {sekunder = "0"+sekunder}
  return ([time, minutter, sekunder])
}
