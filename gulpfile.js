var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  return gulp.
    src('./angular/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./angular/bin'));
});

gulp.task('test', function() {
  var error = false;
  gulp.
    src('./test.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests passed!');
      }
    });
});

gulp.task('watch', function() {
  gulp.watch(['./*.js'], ['test']);
  gulp.watch(['./angular/*.js'], ['browserify']);
});