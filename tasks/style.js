/* jshint node:true */
var gulp = require('gulp');
var less = require('gulp-less');

module.exports = function(rootDir, config) {
    return gulp.src(rootDir + '/style/test.less')
        .pipe(less())
        .pipe(gulp.dest(rootDir + '/ui-test/'));
};
