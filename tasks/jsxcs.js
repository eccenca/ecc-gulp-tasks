/* jshint node:true */
var gulp = require('gulp');
var jscs = require('gulp-jscs');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*')
        .pipe(jscs());
};
