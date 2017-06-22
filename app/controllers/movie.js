var Movie = require("../models/movie");
var Comment = require("../models/comment");
var _ = require("underscore");

// detail movie page
exports.detailMoviePage = function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		Comment
			.find({movie: id})
			.populate("from", "name")
			.populate("reply.from reply.to", "name")
			.exec(function(err, comments){
				console.log(comments[0]['reply'])
				res.render("detail", { 
					title: "imooc " + movie.title,
					movie: movie,
					comments: comments,
					reply: comments.reply
				});
			})
	});
};

// admin update movie
exports.adminUpdateMovie = function(req, res){
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
};

// admin post movie
exports.adminPostMovie = function(req, res){
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
};

// admin page
exports.adminPage = function(req, res){
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
};

// list page
exports.listPage = function(req, res){
	Movie.fetch(function(err, movies){
		if(err) console.log(err);
		res.render("list", { 
			title: "imooc 列表页" ,
			movies: movies
		});
	});
};

// remove list
exports.removeList = function(req, res){
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
};
