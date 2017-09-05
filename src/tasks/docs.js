const gulp = require('gulp');
const concat = require('gulp-concat');

module.exports = function(config, callback) {
    gulp
        .src(['.tmp/Components.md', '.tmp/Store.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('.tmp'));
    callback(null, null);
};
