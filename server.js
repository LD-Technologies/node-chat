var express = require('express');

var server = express.createServer();
	//setup server environment
	server.use(express.cookieParser());
	server.use(express.session({ secret: "keyboard unicorn" }));
	server.use(express.bodyParser());
	server.use(express.methodOverride());
	server.use(server.router);
	server.engine('.html', require('ejs').__express);
	server.set('views', __dirname + '/lib/views');
	server.set('view options', {
		layout: false
	});
	server.set('view engine', 'html');
	server.use('/', express.static(__dirname + '/assets'));
	

var sessions = [];


// chat room object

var chatRoom = function() {
	var messages = [];
	var users = [];
	var callbacks = [];
	var sessions = [];
	
	// room public functions
	this.query = function( since, callback ) {
		var results = [];
		messages.forEach(function(message) {
			if( message.timestamp > since ) {
				results.push(message);
			}
		});
		callback.apply(this, [results]);
	};
	
	this.addUser = function( user, callback ) {
		if( users.indexOf(user) !== -1 ) {
			callback.apply(this);
		}
		var u = {
			name: user,
			id: users.length
		}
		users.push(u);
		callback.apply(this, [u]);
	};
	
	this.addMessage = function( user, message ) {
		var message = {
			'user': user,
			'timestamp': (new Date()).getTime(),
			'text': message
		};
		messages.push(message);
	};
};

var room = new chatRoom();

var routes = {
	root: function(req, res) {
		res.render('index', {
			'page_title': 'LD-Tech Chat'
		});
	},
	send: function(req, res) {
		var text = req.param('text');
		var name = req.param('name');
		room.addMessage(name, text);
		res.send(1);
	},
	recv: function(req, res) {
		var since = req.param('since');
		room.query(since, function(messages) {
			res.send(messages);
		});
	},
	join: function(req, res) {
		var nick = req.param('name');
		room.addUser(nick, function(data) {
			res.send(data);
		});
	}
};

server.get('/', routes.root);
server.post('/send', routes.send);
server.post('/recv', routes.recv);
server.post('/join', routes.join);

server.listen(4000);
