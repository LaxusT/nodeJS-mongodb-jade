var Index = require("../app/controllers/index");
var User = require("../app/controllers/user");
var Movie = require("../app/controllers/movie");
var Comment = require("../app/controllers/comment");
var Category = require("../app/controllers/category");

module.exports = function(app){
	// pre handle user
	app.use(function(req, res, next){
		var _user = req.session.user;
		app.locals.user = _user;
		return next()
	})

	// index 
	app.get("/", Index.index);

	// movie
	app.get("/movie/:id", Movie.detailMoviePage);
	app.get("/admin/update/:id", User.signinRequired, User.adminRequired, Movie.adminUpdateMovie);
	app.post("/admin/movie", User.signinRequired, User.adminRequired, Movie.adminPostMovie);
	app.get("/admin", User.signinRequired, User.adminRequired, Movie.adminPage);
	app.get("/admin/list", User.signinRequired, User.adminRequired, Movie.listPage);
	app.delete("/admin/list", User.signinRequired, User.adminRequired, Movie.removeList);

	// user
	app.post("/user/signup", User.signup);
	app.post("/user/login", User.login);
	app.get("/logout", User.logout);
	app.get("/admin/userlist", User.signinRequired, User.adminRequired, User.userList);
	app.get("/signin", User.signinPage);
	app.get("/signup", User.signupPage);

	// comment
	app.post("/user/comment", User.signinRequired, Comment.save);

	// category
	app.get("/admin/category/new", User.signinRequired, User.adminRequired, Category.adminCategoryPage);
	app.post("/admin/category", User.signinRequired, User.adminRequired, Category.saveCategory);
	app.get("/admin/category/list", User.signinRequired, User.adminRequired, Category.categoryListPage);
};
