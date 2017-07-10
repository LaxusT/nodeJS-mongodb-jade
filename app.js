var express = require("express");
var path = require("path");
var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var morgan = require('morgan');

var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/imooc");
app.use(cookieParser());
app.use(session({
  	secret: 'imooc',
  	resave: false,
  	saveUninitialized: false,
	store: new mongoStore({
		url: "mongodb://localhost:27017/imooc",
		auto_reconnect: true,
		collection: "sessions"
	})
}));

if(app.get("env") === "development"){
	app.set("showStackError", true);
	app.use(morgan(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set("debug", true);
}

app.set("views", "./app/views/pages");
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
require("./router/routes")(app);
app.listen(port);
