/* jshint node:true */
var gulp = require('gulp');
var jshint = require('gulp-jshint');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
};
