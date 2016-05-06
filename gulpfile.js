var gulp = require('gulp');

var mocha = require('gulp-spawn-mocha');

gulp.task('test', function () {
    return gulp.src(['test/*.test.js'], {read: false})
        .pipe(mocha({
            env: {'NODE_ENV': 'test'}
        }));
});
