/* jshint node:true */
var gulp = require('gulp');
var jsxcs = require('gulp-jsxcs');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*')
        .pipe(jsxcs());
};
