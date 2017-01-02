const gulp = require('gulp');
const eslint = require('gulp-eslint');

module.exports = function(config) {
    const files = config.lintingFiles || '';

    let stream = gulp
        .src(files)
        .pipe(eslint());

    if (process.env.NODE_ENV !== 'test') {
        stream = stream.pipe(eslint.format());
    }

    return stream.pipe(eslint.failOnError());

};
