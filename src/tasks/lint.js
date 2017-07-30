const gulp = require('gulp');
const util = require('gulp-util');
const eslint = require('gulp-eslint');

module.exports = function(config) {
    util.log(
        util.colors.yellow('[DEPRECATION WARNING]'),
        'You use a package.json script (`lint`) for this.'
    );

    const files = config.lintingFiles || '';

    let stream = gulp.src(files).pipe(eslint());

    if (process.env.NODE_ENV !== 'test') {
        stream = stream.pipe(eslint.format());
    }

    return stream.pipe(eslint.failOnError());
};
