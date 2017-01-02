const gulp = require('gulp');
const change = require('gulp-change');
const rename = require('gulp-rename');
const checker = require('ecc-license-checker');

module.exports = function(config) {
    return gulp
        .src(config.licenseReport.input)
        .pipe(change(checker.yaml2json))
        .pipe(rename(config.licenseReport.outputName))
        .pipe(gulp.dest(config.licenseReport.outputPath));
};
