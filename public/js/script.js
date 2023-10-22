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

    var prevTime = [0,0]
    socket.on('chat message', function (msg) {
      console.log(prevTime)
      if (prevTime[0] != msg.timeOfSend[0]+msg.timeOfSend[1] || prevTime[1] != msg.timeOfSend[3]+msg.timeOfSend[4]){
        console.log(msg.timeOfSend[0]+msg.timeOfSend[1]+":"+msg.timeOfSend[3]+msg.timeOfSend[4])
        var timeStamp = document.createElement("p")
        var timeStampDiv = document.createElement("div")
        timeStampDiv.id = "timeStampDiv"
        timeStamp.id = "timeStamp"
        timeStamp.textContent = (msg.timeOfSend[0]+msg.timeOfSend[1]+":"+msg.timeOfSend[3]+msg.timeOfSend[4])
        console.log("timeStamp generated - "+msg.timeOfSend)
        timeStampDiv.appendChild(timeStamp)
        messageDiv.appendChild(timeStampDiv)
      }
      if (!msg.senderID == myId) {playNotification()}
      var message1 = document.createElement('p');
      prevTime[0] = msg.timeOfSend[0]+msg.timeOfSend[1]
      prevTime[1] = msg.timeOfSend[3]+msg.timeOfSend[4]
      message1.textContent = (msg.user + " - " + msg.message);
      message1.id = msg.senderID
      console.log("my id: "+myId)
      
      if (message1.id == myId) {
        var myMessageDiv = document.createElement("div")
        myMessageDiv.id = "mymesdiv"
        message1.className = "myMessage"
        message1.textContent = (msg.message)
        myMessageDiv.appendChild(message1)
        messageDiv.appendChild(myMessageDiv);
      } else {
        messageDiv.appendChild(message1)
      }
      var scrollableDiv = document.getElementById('messages');
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
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

function playNotification() {
  var audio = new Audio('../Assets/notif.mp3');
  audio.play();
}