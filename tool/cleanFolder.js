var gulp = require("gulp");
var clean = require('gulp-clean');

function clean(folderPath){
	return gulp.src(folderPath)
    	.pipe(clean());
}

module.exports = clean;
