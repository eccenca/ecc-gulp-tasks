/* jshint node:true */
var path = require('path');
var gulp = require('gulp');
var shell = require('gulp-shell');
var replace = require('gulp-replace');

var jsxhintCmd = path.join(__dirname, '..', 'node_modules', '.bin', 'jsxhint');

module.exports = function(rootDir, config) {
    return gulp.src('./src/**/*.jsx', {read: false})
        .pipe(shell(jsxhintCmd + ' <%= file.path %>'))
        .pipe(replace(/stdout:(.+?)\n/g, '$1'));
};
