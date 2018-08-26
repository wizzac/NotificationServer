var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var OneSignal = require('onesignal-node');    

var myClient = new OneSignal.Client({    
   userAuthKey: 'YzUzNWJlYTAtMDcyYS00M2QyLTg1MDEtMDBmMTMzZjJlODZm',    
   // note that "app" must have "appAuthKey" and "appId" keys    
   app: { appAuthKey: 'ZDAyMDBiMzktMjhlYy00ZmNmLThkMjUtOTVhN2E1YTg5MjY1', appId: '8dc3eec7-2330-4ecb-be62-9ee174ca04e0' }    
});    


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let last_user;
let connectedUserMap=new Map();

var firstNotification = new OneSignal.Notification({    
    contents: {    
        en: "Test notification",    
        tr: "Test mesajı"    
    },  
    included_segments: ["Active Users", "Inactive Users"]  
});    
firstNotification.postBody["included_segments"] = ["Active Users"];    



io.on('connection', function(socket){
	
	/*myClient.sendNotification(firstNotification, function (err, httpResponse,data) {    
	   if (err) {    
	       console.log('Something went wrong...');    
	   } else {    
	       console.log(data, httpResponse.statusCode);    
	   }    
	});    */


/*	let connectedUserId = socket.id;
		connectedUserMap.set(socket.id, { status:'online'});
    	socket.on('user_does_something', function(){
        
		});
*/


  	socket.broadcast.emit('user connected');
  	socket.on('chat message', function(msg,nickname){
		console.log('me hablo '+nickname);
  		connectedUserMap.set(socket.id, { name:nickname,status:'online'});
    	last_user=nickname;
    	
    	if(nickname=='wizzac'){
    		io.emit('chat message',msg,last_user);
    	}else{
    		io.emit('chat especific',msg,last_user);
    	}

  		console.log('interceptando: ' + msg);
  		console.log(connectedUserMap);

  	});



   socket.on('disconnect',function(socket1){
  	console.log(connectedUserMap.get(socket.id).name);
  	if(socket.id!='undefined'){
  		connectedUserMap.set(socket.id,{});
  	}



  });


});

http.listen( port, function(){
  console.log('listening on *:' + port);
});
