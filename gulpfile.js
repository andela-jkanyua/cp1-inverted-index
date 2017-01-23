/* File: gulpfile.js */

// grab our packages
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jasmineNode = require('gulp-jasmine-node');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('lint', () => {
  return gulp.src(['./src/**/*.js', './jasmine/spec/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', () => {
  gulp.watch(['./src/**/*.js', './jasmine/spec/**/*.js'], ['lint']);
});

// configure gulp to run jasmine-node tests
gulp.task('test', () => {
  return gulp.src(['./src/**/*.js', './jasmine/spec/**/*.js'])
  .pipe(jasmineNode({
    timeout: 10000,
    includeStackTrace: false,
    color: true,
  }));
});
