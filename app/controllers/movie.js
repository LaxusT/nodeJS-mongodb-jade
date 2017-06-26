var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
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
	if(id){
		Category.find({}, function(err, categories){
			Movie.findById(id, function(err, movie){
				if(err) console.log(err);
				res.render("admin", {
					title: "imooc 更新页",
					movie: movie,
					categories: categories
				});
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
	if (id) {
		// delete movieObj.id;
		// var conditions = {_id: id};
		// var updates = {$set: movieObj}
		// Movie.update(conditions, updates, function(err){
		// 	if(err) console.log(err);
		// 	console.log("成功")
		// })
		Movie.findById(id, function(err, movie){
			if(err) console.log(err);
			delete movieObj.id;
			_movie = _.extend(movie, movieObj);
			console.log(_movie)
			_movie.save(function(err, movie){
				if(err) console.log(err);
				res.redirect("/movie/" + movie._id);
			});
		});
	} else {
		_movie = new Movie(movieObj);
		var categoryId = _movie.category;
		_movie.save(function(err, movie){
			if(err) console.log(err);
			Category.findById(categoryId, function(err, category){
				category.movies.push(movie._id)
				category.save(function(err, category){
					res.redirect("/movie/" + movie._id);
				})
			})
		});
	}
};

// admin page
exports.adminPage = function(req, res){
	Category.find({}, function(err, categories){
		res.render("admin", { 
			title: "imooc 后台",
			categories: categories,
			movie: {}
		});
	})
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
