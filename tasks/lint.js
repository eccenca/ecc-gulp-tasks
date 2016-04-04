var gulp = require('gulp');
var eslint = require('gulp-eslint');
var path = require('path');
var configPath = path.join(__dirname, '..', 'rules', 'eslintrc.yml');

module.exports = function(config) {
    var files = config.lintingFiles || '';
    return gulp
        .src(files)
        .pipe(eslint({configFile: configPath}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
};
