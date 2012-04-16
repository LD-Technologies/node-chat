var express = require('express');

var server = express.createServer();
	//setup server environment
	server.use(express.bodyParser());
	server.use(express.cookieParser("keyboard unicorn"));
	server.use(express.session({ secret: "keyboard unicorn" }));
	server.use(express.methodOverride());
	server.engine('.html', require('ejs').__express);
	server.set('views', __dirname + '/lib/views');
	server.set('view options', {
		layout: false
	});
	server.set('view engine', 'html');
	server.use('/', express.static(__dirname + '/assets'));
	

var sessions = [];

server.get('/', function( req, res ) {
	console.log("sessions", sessions);
	res.render('index', {
		'page_title': 'sample title - ' + sessions.length
	});
});

server.get('/room', function( req, res ) {
	res.render('index', {
		'page_title': 'sample title #2 - ' + sessions[req.session.id].nickname
	});
});

server.post('/join', function( req, res ) {
	var session, nickname = req.param('nickname');
	if( !sessions[req.session.id] ) {
		session = {
			'nickname': nickname,
			'sid': req.session.id,
			'timestamp': new Date(),
			'poke': function() {
				session.timestamp = new Date();
			},
			'destroy': function() {
				delete sessions[session.sid];
			}
		};
		sessions[session.sid] = session;
	}
	console.log(req.session.id, sessions);
	res.send(1);
});

server.listen(4000);
