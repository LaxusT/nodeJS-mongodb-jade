var gulp = require("gulp");
var jshint = require("gulp-jshint");
var map = require("map-stream");
var fs = require("fs");

var txtErrorNum = 0;
var myReporter = map(function (file, cb) {
  if (file.jshint.success) {
    return cb(null, file);
  }
  var results = "";
  console.log('JSHINT fail in', file.path);
  results += 'JSHINT fail in' + file.path + "\n";
  file.jshint.results.forEach(function (result) {
    if (!result.error) {
      return;
    }
    var err = result.error
    console.log(`  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}`);
    results += `  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}` + "\n";
  });
  txtErrorNum++;
  fs.writeFileSync("./tool/jsLintError/" + txtErrorNum + ".txt", results, function(err){
    if(err) console.log(err);
  })
  cb(null, file);
});


function lint(fileArr){
  gulp.src(fileArr)
    .pipe(jshint())
    .pipe(myReporter)
}

module.exports = lint;
