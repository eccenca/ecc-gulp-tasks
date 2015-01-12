/* jshint node:true */
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var to5Browserify = require('6to5ify');

module.exports = function(rootDir, config) {
    // place code for your default task here
    var bundler = browserify({
        entries: rootDir + '/ui-test/ui-test.jsx',
        extensions: ['js', 'jsx'],
        //debug: true
    });
    bundler.transform(reactify);
    bundler.transform(to5Browserify);

    return bundler
        .bundle()
        .pipe(source('component.min.js'))
        .pipe(gulp.dest(rootDir + 'ui-test/'));
};
