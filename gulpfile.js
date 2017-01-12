/* File: gulpfile.js */

// grab our packages
var gulp 			= require('gulp'),
    jshint 			= require('gulp-jshint'),
    //jasmineBrowser 	= require('gulp-jasmine-browser'),
    jasmineNode = require('gulp-jasmine-node');
    watch = require('gulp-watch');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', './jasmine/spec/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js', './jasmine/spec/**/*.js' ], ['lint']);
});


gulp.task('test', function () {
    return gulp.src(['./src/**/*.js', './jasmine/spec/**/*.js'])
    .pipe(jasmineNode({
        timeout: 10000,
        includeStackTrace: false,
        color: true
    }));
});

