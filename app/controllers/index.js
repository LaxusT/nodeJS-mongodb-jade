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
