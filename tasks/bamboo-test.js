/* eslint no-var: 0 */

var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');

module.exports = function(config) {
    return gulp
        .src(config.testEntryPoint)
        .pipe(mocha({
            R: 'mocha-bamboo-reporter',
            compilers: 'jsx?:babel-core/register',
        }));
};
