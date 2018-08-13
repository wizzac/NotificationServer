var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var last_user;

io.on('connection', function(socket){
  	console.log("entro alguien");
  	socket.broadcast.emit('user connected');
    	
  	socket.on('chat message', function(msg,nickname){
  	//	socket.on('send-nickname', function(nickname) {
    		last_user=nickname;
	//});
  		console.log('interceptando: ' + msg);
    	io.emit('chat message',msg,last_user);
  	});

   socket.on('disconnect',function(socket){
  	console.log("se fue alguien");
  });


});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
