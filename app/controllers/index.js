var Movie = require("../models/movie");
var _ = require("underscore");

// index page
exports.index = function(req, res){
	Movie.fetch(function(err, movies){
		if(err) console.log(err);

		res.render("index", { 
			title: "imooc" ,
			movies: movies
		});
	});
}
