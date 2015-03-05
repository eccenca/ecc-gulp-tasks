/* jshint node:true */
var gulp = require('gulp');
var shell = require('gulp-shell');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*.jsx', {read: false})
        .pipe(shell('jsxhint <%= file.path %>'));
};
