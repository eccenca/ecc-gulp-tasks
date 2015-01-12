/* jshint node:true */
var gulp = require('gulp');
var sass = require('gulp-sass');

module.exports = function(rootDir, config) {
    return gulp.src(rootDir + '/scss/test.scss')
        .pipe(sass())
        .pipe(gulp.dest(rootDir + '/ui-test'));
};
