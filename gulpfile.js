var gulp = require('gulp');

var mocha = require('gulp-spawn-mocha');

var lint = require('./tasks/lint');

gulp.task('test', function() {
    return gulp.src(['test/*.test.js'], {read: false})
        .pipe(mocha({
            env: {'NODE_ENV': 'test'}
        }));
});

gulp.task('lint', function() {
    return lint({lintingFiles: './tasks/*.js'});
});
