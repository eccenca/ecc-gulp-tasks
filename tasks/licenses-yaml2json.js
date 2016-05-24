/* eslint no-var: 0 */

var gulp = require('gulp');
var change = require('gulp-change');
var checker = require('ecc-license-checker');

module.exports = function(config) {
    return gulp
        .src(config.licenseReport.input)
        .pipe(change(checker.yaml2json))
        .pipe(rename(config.licenseReport.outputName))
        .pipe(gulp.dest(config.licenseReport.outputPath));
};
