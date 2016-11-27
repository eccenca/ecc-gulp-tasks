/* eslint no-var: 0 */

var gulp = require('gulp');
var eslint = require('gulp-eslint');

module.exports = function(config) {
    var files = config.lintingFiles || '';

    var stream = gulp
        .src(files)
        .pipe(eslint());

    if (process.env.NODE_ENV !== 'test') {
        stream = stream.pipe(eslint.format());
    }

    return stream.pipe(eslint.failOnError());

};
