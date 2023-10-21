
document.addEventListener('DOMContentLoaded', function () {
const formDiv = document.getElementById('formdiv')
const loginDiv = document.getElementById('logindiv')
const usernameButton = document.getElementById('usernamebutton')
const usernameInput = document.getElementById('usernameinput')
var myId = -1
console.log("script loaded")
    var socket = io();

    var form = document.getElementById('form');
    var input = document.getElementById('m');
    var messages = document.getElementById('messages');

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
      var listItem = document.createElement('li');
      listItem.textContent = (msg.timeOfSend + " - " + msg.user + " - " + msg.message);
      messages.appendChild(listItem);
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
