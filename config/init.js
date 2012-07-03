module.exports = function(client) {

	// Delete all socket.io's sockets data from Redis
	client.smembers('socketio:sockets', function(err, sockets) {
		if(sockets.length) client.del(sockets);
		console.log('Deletion of socket.io stored sockets data >> ', err || "Done!");
	});
	
};