/* jshint node:true */
var gulp = require('gulp');

module.exports = function(rootDir, config) {
    gulp.watch([rootDir + '/src/**/*', rootDir + '/test/*.jsx'], ['build']);
    gulp.watch([rootDir + '/style/**/*'], ['style']);
};
