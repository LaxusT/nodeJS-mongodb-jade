var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var _ = require("underscore");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");

// detail movie page
exports.detailMoviePage = function (req, res) {
	var id = req.params.id;
	Movie.findById(id, function (err, movie) {
		Comment
			.find({ movie: id })
			.populate("from", "name")
			.populate("reply.from reply.to", "name")
			.exec(function (err, comments) {
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
exports.adminUpdateMovie = function (req, res) {
	var id = req.params.id;
	if (id) {
		Category.find({}, function (err, categories) {
			Movie.findById(id, function (err, movie) {
				if (err) console.log(err);
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
exports.adminPostMovie = function (req, res) {
	var id = null;
	if ("id" in req.body) {
		id = req.body.id;
	}
	var movieObj = req.body;
	var _movie = null;
	if(req.poster){
		console.log('zhaojinxin')
		console.log(req.poster)
		console.log()
		movieObj.poster = req.poster;
	}
	if (id) {
		Movie.findById(id, function (err, movie) {
			var categoryId = movie.category;
			var movieId = movie._id;
			Category.findById(categoryId, function (err, category) {
				if (err) console.log(err);
				var arr = [];
				category.movies.forEach(function (item, index) {
					if (item.toString() !== movieId.toString()) {
						arr.push(mongoose.Types.ObjectId(item));
					}
				})
				category.movies = arr;
				category.save(function (err, category) {
					if (err) console.log(err)
					_movie = _.extend(movie, movieObj);
					var categoryId = _movie.category;
					_movie.save(function (err, movie) {
						if (err) console.log(err);
						Category.findById(categoryId, function (err, category) {
							category.movies.push(movie._id)
							category.save(function (err, category) {
								res.redirect("/movie/" + movie._id);
							})
						})
					});
				})
			})
		});
	} else {
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function (err, movie) {
			if (err) console.log(err);

			if (categoryId) {
				Category.findById(categoryId, function (err, category) {
					category.movies.push(movie._id)
					category.save(function (err, category) {
						res.redirect("/movie/" + movie._id);
					})
				})
			} else if (categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function (err, category) {
					movie.category = category._id;
					movie.save(function (err, movie) {
						res.redirect("/movie/" + movie._id);
					})
				})
			}
		});
	}
};

// admin poster movie file
exports.savePoster = function (req, res, next) {
	var posterData = req.file;
	var filePath = posterData.path;
	var originalFilename = posterData.originalname;

	if (originalFilename) {
		fs.readFile(filePath, function (err, data) {
			var timestamp = Date.now();
			var type = posterData.mimetype.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', './public/uploda/' + poster)
			fs.writeFile(newPath, data, function(err){
				req.poster = poster;
				next()
			})

		});
	} else {
		next()
	}
}

// admin page
exports.adminPage = function (req, res) {
	Category.find({}, function (err, categories) {
		res.render("admin", {
			title: "imooc 后台",
			categories: categories,
			movie: {}
		});
	})
};

// list page
exports.listPage = function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) console.log(err);
		res.render("list", {
			title: "imooc 列表页",
			movies: movies
		});
	});
};

// remove list
exports.removeList = function (req, res) {
	var id = req.query.id;
	console.log(req);
	if (id) {
		Movie.remove({ _id: id }, function (err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({ success: 1 });
			}
		});
	}
};
