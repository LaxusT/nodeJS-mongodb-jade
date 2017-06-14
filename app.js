var express = require("express");
var path = require("path");
var port = 3000;
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Movie = require("./models/movie");
var _ = require("underscore");

mongoose.connect("mongodb://localhost:27017/imooc")

app.set("views", "./views/pages")
app.set("view engine", "pug")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "bower_components")))
app.listen(port)

// index page
app.get("/", function(req, res){
	Movie.fetch(function(err, movies){
		if(err) console.log(err)

		res.render("index", { 
			title: "imooc 首页" ,
			movies: movies
		})
	})
})

// detail page
app.get("/movie/:id", function(req, res){
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		res.render("detail", { 
			title: "imooc " + movie.title,
			movie: movie 
		})
	})
})

// admin update movie
app.get("/admin/update/:id", function(req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			if(err) console.log(err)

			res.render("admin", {
				title: "imooc 更新页",
				movie: movie
			})
		})
	}
})

// admin post movie
app.post("/admin/movie", function(req, res){
	var id = null;
	console.log(req.body)
	if("id" in req.body){
		id = req.body.id;
	}
	var movieObj = req.body;
	var _movie = null;

	if (id !== null) {
		Movie.findById(id, function(err, movie){
			if(err) console.log(err)

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err) console.log(err)
				res.res.redirect("/movie/" + movie.id)
			})
		})
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
		})

		_movie.save(function(err, movie){
			if(err) console.log(err)
			res.redirect("/movie/" + movie._id)
		})
	}
})

// admin page
app.get("/admin", function(req, res){
	res.render("admin", { 
		title: "imooc 后台",
		movie: {
			title: "title",
			director: "director",
			country: "country",
			language: "language",
			poster: "poster",
			flash: "flash",
			year: "year",
			summary: "summary"
		}
	})
})

// list page
app.get("/admin/list", function(req, res){
	Movie.fetch(function(err, movies){
		if(err) console.log(err)

		res.render("list", { 
			title: "imooc 首页" ,
			movies: movies
		})
	})
})







