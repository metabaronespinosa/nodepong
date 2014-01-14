#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var express = require('express'),
	app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/';

 
if(process.env.SUBDOMAIN){
  url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

app.use(express.static(__dirname + '/'));

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/control', function (req, res) {
  res.sendfile(__dirname + '/pad.html');
});

	
io.sockets.on('connection', function (socket) {
  
  socket.on('setNick', function (name,fn) {
    socket.set('nickname', name);
	fn(name);
    });
  
  socket.on('moveSocket',function(dir){
  socket.get('to',function(err,to){
  io.sockets.socket(to).emit('movePaddle',dir);
  });
  });
  
  socket.on('startNow',function(){
  socket.get('to',function(err,to){
  io.sockets.socket(to).emit('startRun');
  });  
  })
  
  socket.on('evalNick',function(code,fn){
  
	io.sockets.clients().forEach(function(s) {    
	s.get('nickname', function(err, nickname) {
		fn(s.id);
		if(nickname==code){
		socket.set('to',s.id);
		io.sockets.socket(s.id).emit('connPong');
		
		}
    });
	
	});
	
  });
  
  
  });

 
	
	
	
	
	
	
