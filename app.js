var express = require("express");
var path = require("path");
var port = 3000;
var app = express();
var bodyParser = require("body-parser");

app.set("views", "./views/pages")
app.set("view engine", "pug")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "bower_components")))
app.listen(port)

// index page
app.get("/", function(req, res){
	res.render("index", { 
		title: "imooc 首页" ,
		movies: [
			{
				title: "机械战警",
				id: 1,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			},
			{
				title: "机械战警",
				id: 2,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			},
			{
				title: "机械战警",
				id: 3,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			},
			{
				title: "机械战警",
				id: 4,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			},
			{
				title: "机械战警",
				id: 5,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			},
			{
				title: "机械战警",
				id: 6,
				poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
			}
		]
	})
})

// list page
app.get("/list", function(req, res){
	res.render("list", { title: "imooc 列表页" })
})

// detail page
app.get("/detail", function(req, res){
	res.render("detail", { title: "imooc 详情页" })
})

// admin page
app.get("/admin", function(req, res){
	res.render("admin", { title: "imooc 后台" })
})