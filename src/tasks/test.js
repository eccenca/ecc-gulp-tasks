const gulp = require('gulp');
const mocha = require('gulp-spawn-mocha');

module.exports = function(config) {
    return gulp
        .src(config.testEntryPoint)
        .pipe(mocha({
            compilers: 'jsx?:babel-core/register',
        }));
};
