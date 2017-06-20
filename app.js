var express = require("express");
var path = require("path");
var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Movie = require("./models/movie");
var User = require("./models/user");
var _ = require("underscore");

var session = require("express-session");
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized: false
}));

mongoose.connect("mongodb://localhost:27017/imooc");

app.set("views", "./views/pages");
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
app.listen(port);

// index page
app.get("/", function(req, res){
	console.log(req.session.user);
	Movie.fetch(function(err, movies){
		if(err) console.log(err);

		res.render("index", { 
			title: "imooc" ,
			movies: movies
		});
	});
});

// detail page
app.get("/movie/:id", function(req, res){
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		res.render("detail", { 
			title: "imooc " + movie.title,
			movie: movie 
		});
	});
});

// admin update movie
app.get("/admin/update/:id", function(req, res){
	var id = req.params.id;
	console.log(id);
	if(id){
		Movie.findById(id, function(err, movie){
			if(err) console.log(err);
			res.render("admin", {
				title: "imooc 更新页",
				movie: movie
			});
		});
	}
});

// admin post movie
app.post("/admin/movie", function(req, res){
	var id = null;
	if("id" in req.body){
		id = req.body.id;
	}
	var movieObj = req.body;
	var _movie = null;

	if (id !== null) {
		Movie.findById(id, function(err, movie){
			if(err) console.log(err);

			_movie = _.extend(movie, movieObj);
			__movie = new Movie({
				director: _movie.director,
				title: _movie.title,
				country: _movie.country,
				language: _movie.language,
				year: _movie.year,
				poster: _movie.poster,
				summary: _movie.summary,
				flash: _movie.flash
			});
			__movie.save(function(err, movie){
				if(err) console.log(err);
				res.redirect("/movie/" + movie.id);
			});
		});
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie){
			if(err) console.log(err);
			res.redirect("/movie/" + movie._id);
		});
	}
});

// admin page
app.get("/admin", function(req, res){
	res.render("admin", { 
		title: "imooc 后台",
		movie: {
			title: "",
			director: "",
			country: "",
			language: "",
			poster: "",
			flash: "",
			year: "",
			summary: ""
		}
	});
});

// list page
app.get("/admin/list", function(req, res){
	Movie.fetch(function(err, movies){
		if(err) console.log(err);

		res.render("list", { 
			title: "imooc 列表页" ,
			movies: movies
		});
	});
});

// remove list
app.delete("/admin/list", function(req, res){
	var id = req.query.id;
	console.log(req);

	if(id){
		Movie.remove({_id: id}, function(err , movie){
			if(err) {
				console.log(err);
			} else {
				res.json({success:1});
			}
		});
	}
});

// signup
app.post("/user/signup", function(req, res){
	var reqUser = req.body;
	var _user = new User(req.body);
	User.find({name: reqUser.name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(Object.keys(user).length !== 0){
			console.log("用户已注册");
		} else {
			_user.save(function(err, user){
				if(err){
					console.log(err);
				}
				res.redirect("/admin/userlist");
			});
		}
	});
});

// login
app.post("/user/login", function(req, res){
	var _user = req.body;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err);
		}

		if(!user){
			console.log("用户不存在");
			return res.redirect("/");
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}

			if(isMatch){
				req.session.user = user;
				console.log("登录成功");
			} else {
				console.log("登录失败");
			}
		});
	});
});

// user list page
app.get("/admin/userlist", function(req, res){
	User.fetch(function(err, users){
		if(err) console.log(err);

		res.render("userList", { 
			title: "用户列表页" ,
			users: users
		});
	});
});











