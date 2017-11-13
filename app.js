var express = require('express');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var port = process.env.PORT || 3000;
var debug = require("debug")("ag");
var name = 'visychat';

debug('booting %s', name);
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
users = [];
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('setUsername', function(data){
    console.log(data);
    if(users.indexOf(data) > -1){
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else{
      users.push(data);
      socket.emit('userSet', {username: data});
    }
    socket.on('disconnect', function () {
    	console.log('User disconnected');
  	});
  });
  socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
  })
});
http.listen(port, function(){
  var addr = http.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);

});