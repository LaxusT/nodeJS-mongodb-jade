var User = require("../models/user");
var _ = require("underscore");

// signin page
exports.signinPage = function(req, res){
	res.render("signin")
};

// signup page
exports.signupPage = function(req, res){
	res.render("signup")
}

// signup
exports.signup = function(req, res){
	var reqUser = req.body;
	var _user = new User(req.body);
	User.find({name: reqUser.name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(Object.keys(user).length !== 0){
			console.log("用户已注册");
			res.render("/signin")
		} else {
			console.log("注册成功")
			_user.save(function(err, user){
				if(err){
					console.log(err);
				}
				req.session.user = user;
				res.redirect("/");
			});
		}
	});
};

// login
exports.login = function(req, res){
	var _user = req.body;
	console.log(req.body)
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			console.log("用户不存在");
			return res.redirect("/signup");
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				req.session.user = user;
				console.log("登录成功");
				res.redirect("/");
			} else {
				res.redirect("/signin")
				console.log("登录失败");
			}
		});
	});
};

// logout
exports.logout = function(req, res, app){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect("/signin");
};

// user list page
exports.userList = function(req, res){
	User.fetch(function(err, users){
		if(err) console.log(err);
		res.render("userList", { 
			title: "用户列表页",
			users: users
		});
	});
};

// midware of user
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	console.log(user);

	if(!user){
		return res.redirect("/signin")
	}

	next()
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	console.log(user.role)

	if(user.role <= 10){
		return res.redirect("/signin")	
	}

	next()
}




