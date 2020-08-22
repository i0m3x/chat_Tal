const yo = require('yo-yo')
const io = require('socket.io-client')
const socket = io()
let listOfRooms = undefined
let domMessages = undefined
let currentChannel = "home"
function makeList(messages){
  return yo`<div id="list">
          <ul>
            <li class="channel">The current channel is ${currentChannel}</li>
            ${messages.map(message => {
              return yo`<li class="message">
              <span class="message_sender">${message.username} : </span><span class="message_text">${message.text}</span>
              </li>`
            })}
          </ul>
          </div>`
}
function makeRooms(rooms){
  return yo`<select name="rooms" id="rooms">
            ${rooms.map(room => {
              return yo `<option value=${room}>
                        ${room}
                        </option>`
            })}
            </select>`
}
function postMessage (text, channel, username) {
  console.log('posting message')
  fetch('/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, channel: channel, text: text, date: new Date() })
  })
    .then(data => {
      console.log('Success:', data)
      getMessages()
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
function getMessages () {
  fetch('/messages')
  .then(response => response.json())
  .then( data => {
    console.log(data)
    updateMessages(data)
  })
}
function updateMessages(data){
  let listOfMessages = data.messages
  displayMessages = []
  let rooms = {}
  console.log(listOfMessages)
  for(let i = 0; i < listOfMessages.length; i++){
    let message = listOfMessages[i]
    rooms[message.channel] = true
    if(message.channel === currentChannel && message.text != ""){
      displayMessages.push(message)
    }
  }
  console.log(rooms)
  if(displayMessages.length === 0) {
    alert(`no messages in ${currentChannel}, making a new channel... `)
  }
  listOfRooms = makeRooms(Object.keys(rooms))
  domMessages = makeList(displayMessages)
  if(document.getElementById('room_box') != null){
    document.body.removeChild(document.getElementById('room_box'))
  }
  yo.update(listOfRooms, makeRooms(Object.keys(rooms)))
  document.body.appendChild(listOfRooms)
  if(document.getElementById('list') != null){
    document.body.removeChild(document.getElementById('list'))
  }
  yo.update(domMessages, makeList(displayMessages))
  document.body.appendChild(domMessages)
}
socket.on('chat message', (listOfMessages) => {
  updateMessages(listOfMessages)
})
sendMessage.addEventListener('click', () => {
  socket.emit(
    //name of the event being emitted to the backend socket
    'chat message',
    // content of the emit-ion
    { 
      username: document.querySelector('#username_box').value, 
      channel: currentChannel,
      text: document.querySelector('#message').value,
      date: new Date()
    }
    )
})
getMessages()
sendChannel.addEventListener('click', function(event){
  currentChannel = document.querySelector("#channel_box").value
  postMessage("", currentChannel, "", "")
})
select_room.addEventListener('click', function(event){
  currentChannel = document.querySelector('#rooms').value
  updateMessages(listOfRooms)
})