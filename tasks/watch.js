/* jshint node:true */
var gulp = require('gulp');

module.exports = function(rootDir) {
    gulp.watch([rootDir + '/src/**/*', rootDir + '/test/*.jsx'], ['build']);
    gulp.watch([rootDir + '/scss/**/*'], ['scss']);
};
