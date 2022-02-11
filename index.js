// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = 500;

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(port, function() {
  console.log('Starting server on port ' + port);
});
console.clear();
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function(name, centerData) {
    players[socket.id] = {
      uname: name,
      x: centerData.x,
      y: centerData.y,
      id: socket.id
    };
  });
  socket.on('movement', function(pos) {
    var player = players[socket.id] || {};
    player.x = pos.x;
    player.y = pos.y;
  });
  socket.on('disconnect', () => {
    console.log('User left: '+socket.id)
    delete players[socket.id] 
  })
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1);