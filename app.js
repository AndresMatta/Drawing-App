var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

// array of all lines drawn
var line_history = [];

// Array of all messages
var messages = [{  
  id: 1,
  text: "Hola soy un mensaje",
  author: "Andrés Matta"
}];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }
   
   //We also need to send all the messages to the new client
   console.log('Alguien se ha conectado con Sockets');
    socket.emit('messages', messages);

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });

   //Listen for all new messages
   socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
  });

   //Listen for delete event
   socket.on('clearit', function(){
		line_history = [];
		io.emit('clearit', true);
	});
   
});

