/* jshint node:true */
var gulp = require('gulp');
var eslint = require('gulp-eslint');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
};
