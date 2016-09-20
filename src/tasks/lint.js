/* eslint no-var: 0 */

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var path = require('path');
var configPath = path.join(__dirname, '..', 'rules', 'eslintrc.yml');

module.exports = function(config) {
    var files = config.lintingFiles || '';

    var stream = gulp
        .src(files)
        .pipe(eslint({configFile: configPath}));

    if (process.env.NODE_ENV !== 'test') {
        stream = stream.pipe(eslint.format());
    }

    return stream.pipe(eslint.failOnError());

};
