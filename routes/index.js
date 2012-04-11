
exports.index = function(req, res){
  res.render('index', { 
		title: 'BATTLE ARENA - Homepage' 
	});
};

exports.login = function(req, res){
  res.render('login', { 
		title: 'BATTLE ARENA - Login' 
	});
};

exports.register = function(req, res){
  res.render('register', { 
		title: 'BATTLE ARENA - Register' 
	});
};

exports.chatroom = function(req, res){
  res.render('chatroom', { 
		title: 'BATTLE ARENA - Chatroom' 
	});
};