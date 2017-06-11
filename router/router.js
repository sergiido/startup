var Users = require('../model/db');

module.exports = function(app) {

	// app.use(checkAuth); ?

	app.get('/', checkAuth, (req,res) => {
		// console.log('__dirname: ' + __dirname);
		res.redirect('/app');
	});

	app.get('/login', (req, res) => {
		if (typeof req.session.user == 'undefined'){
        	res.render('login', {title: 'myApp', 'message': 'Login', 'errMsg': ''});
		} else {
			res.redirect('/app');
		}
	});

	var authUserList = {
		serg: {
			name: 'Sergii',
			pwd: '12345',
			role: 'admin',
			_id: 1
		},
		margo:{
			name: 'Margarita',
			pwd: '54321',
			role: 'user',
			_id: 2
		}
	}

	app.post('/login', (req, res) => {
		// console.log(req.body);
		// console.log(req.body.name + ':' + req.body.pwd + ':' + req.body.rememberMe);
		if (authUserList.hasOwnProperty(req.body.name)) {
			if (req.body.rememberMe == 'on') {
				var oneMin = 60000;
				req.session.cookie.expires = new Date(Date.now() + oneMin*10);
    			req.session.cookie.maxAge = oneMin*10;
			} else {
				req.session.cookie.expires = false; // enable the cookie to remain for only the duration of the user-agent
			}
			req.session.user = {
				id:   authUserList[req.body.name]._id,
				name: authUserList[req.body.name].name,
				role: authUserList[req.body.name].role
			};
			res.redirect('/app');
		} else {
			res.render('login', {title: 'myApp', message: 'Login', errMsg: 'login or pwd is not valid'});
		}
	});

	 app.get('/app', checkAuth, function(req, res) {
	 	Users.find({}, function(err, data){
			res.render('app', {userDetails: req.session.user, dbdata: data});
	 	})
	});

	app.post('/add', (req, res) => {
		Users.find({login: req.body.login}, function (err, obj) {
			if (err){
				console.log("login " + req.body.login + " already exists");
				return false;
			} else {
				Users.create({
				    name: req.body.name,
				    login: req.body.login,
				    pwd: req.body.pwd,
				    role: req.body.roles,
				    created: Date.now(),
				    active: true
				}, function (err, user) {
					if (err) {
				    	console.log(err);
					}
					res.redirect('/app');
				});
			}
		});
	});

 	app.get('/logout', function(req, res) {
		if (req.session.user) {
			// res.clearCookie('rememberme');
			delete req.session.user;
		}
		res.redirect('/login');
	});

	app.delete('/delete/:id', checkAuth, function (req, res) {
		console.log(req.params.id);
		Users.findById({_id: req.params.id}, function (err, obj) {
			if (err) {
				res.send({status: 400, data: err, message: "failed to delete..."});
			} else {
				obj.remove(function(err){
					if (!err) {
						res.redirect('/app');
					}
				});
			}
		});
	});

	app.put('/update/:id', checkAuth, function (req, res) {
		console.log(req.params.id);
		console.log(req.body._id);
		Users.findById({_id: req.params.id}, function (err, obj) {
			if (err) {
				res.status(400).json({
					err: err //send({status: 400, data: err, message: "failed to update..."});
				});
			} else {
				res.status(200).json({
					obj: obj
				});
				// res.send(obj);
			}
		});
	});

	function checkAuth(req, res, next) {
		// console.log(req.path);
		// console.log(req.session.user);
		if (typeof req.session.user == 'undefined') {
			res.redirect('/login');
		} else {
			next();
		}
	}


}