var gulp = require("gulp");
var nodemon = require("gulp-nodemon");

// clean mission
var clean = require('gulp-clean');
gulp.task('clean', function(){
	return gulp.src("./tool/jsHintError/*")
    	.pipe(clean());
});

// js-lint mission
var jsLint = require("./tool/jsLint");
gulp.task("jsLint", jsLint(["./*.js", "./public/js/*.js", "./schemas/*.js", "./models/*.js"]));

// develop
gulp.task("develop", function(){
	var stream = nodemon({
		script: "app.js",
		ext: "html js",
		ignore: ["ignored.js"],
		tasks: ["clean"]
	});

	stream
		.on("restart", function(){
			console.log("restarted!");
		})
		.on("crash", function(){
			console.error("Application has crashed!\n");
			stream.emit("restart", 10);
		});
});

var runSequence = require('run-sequence');
gulp.task('default', function(callback) {
    runSequence(
    	"clean",
     	"jsLint",
     	"develop"
    );
});
