const express = require('express')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io')(http);
const fs = require('fs')
const port = 8000
http.listen(port, () => {
  console.log(`listening on port: ${port}`);
})
// similiar to a 'require' this allows us to use the request.body in our post request
app.use(express.json());
app.use(express.static('static'))
// Socket connection event
io.on('connection', (socket) => {
  console.log('a user connected');
  // Disconnection event
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})
//log out chat messages and emit it to every open socket, including senders
io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    // at this point, data should be the entire json payload of the request
    fs.readFile('./messages.json', function(err, dataJson){
      if(err){
        socket.emit('error', err)
        console.log(err)
      }
      // take the buffer from the json, call toString to make it a string, then parse to JSON
      let message_list = JSON.parse(dataJson.toString())
      //push our req to it as a JSON object
      message_list.messages.push(message)
      // original buffer + req as string
      const dataToJson = JSON.stringify(message_list)
      fs.writeFile('./messages.json', dataToJson, (err) => {
        if(err){
          socket.emit('error', err)
          console.log(err)
        }
        socket.emit('chat message', message_list);
      })
    })
  });
});
app.get('/messages', (req, res) => {
  console.log("got get request")
  getMessages(req, res)
})
// app.post('/messages', (req, res) => {
//   postMessage(req, res)
// })
// // this is the POST handler for /messages - this function should write a new message to the file
// function postMessage (req, res) {
// }
// this is the GET handler for /messages -- this function should respond with the list of messages
function getMessages (req, res) {
  fs.readFile('./messages.json', function(err, data){
    if(err){
      return res.status(500).send('Something is wrong here')
    }
    let message_list = JSON.parse(data.toString())
    res.json(message_list)
  })
}


