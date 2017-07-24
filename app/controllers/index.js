var Movie = require("../models/movie");
var Category = require("../models/category");
var _ = require("underscore");

// index page
exports.index = function(req, res){
	Category
		.find({})
		.populate({path: "movies", options: {limit: 5}})
		.exec(function(err, categories){
			if(err) console.log(err);
			res.render("index", { 
				title: "imooc" ,
				categories: categories
			});
		})
}

// search page
exports.search = function(req, res){
	var cateId = req.query.cat;
	var page = parseInt(req.query.page, 10) || 0;
	var count = 2;
	var index = page * count;
	var q = req.query.q;

	if(!cateId){
		Movie
			.find({title: new RegExp(q + '.*', 'i')})
			.exec(function(err, movies){
				if(err) console.log(err);

				var results = movies.slice(index, index + count);

				res.render("results", { 
					title: "imooc 结果列表页面",
					keyword: q,
					currentPage: page + 1,
					totalPage: Math.ceil(movies.length / count),
					movies: results,
					query: 'q=' + cateId
				});
			})

		return
	}

	Category
		.find({_id: cateId})
		.populate({
			path: "movies", 
			select: 'title poster',
			options: { limit: 5, skip: index }
		})
		.exec(function(err, categories){
			if(err) console.log(err);

			console.log(Math.ceil(categories[0].movies.length / count))
			var category = categories[0] || {};
			var movies = category.movies || [];
			var results = movies.slice(index, index + count);

			res.render("results", { 
				title: "imooc 结果列表页面",
				keyword: category.name,
				currentPage: page + 1,
				totalPage: Math.ceil(movies.length / count),
				movies: results,
				query: cateId
			});
		})
}
