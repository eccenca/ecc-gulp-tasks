/* jshint node:true */
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

module.exports = function(rootDir, config) {
    // place code for your default task here
    var bundler = browserify({
        entries: rootDir + '/ui-test/ui-test.jsx',
        extensions: ['js', 'jsx'],
        debug: config.debug,
    });
    bundler.transform(babelify);
    if (config.browserifyTransforms) {
        config.browserifyTransforms.forEach(function(transform) {
            bundler.transform(transform);
        });
    }

    return bundler
        .bundle()
        .pipe(source('component.min.js'))
        .pipe(gulp.dest(rootDir + '/ui-test/'));
};
