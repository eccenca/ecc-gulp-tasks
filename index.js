var gulp = require('gulp');

module.exports = function(rootDir, tasks) {
    tasks.forEach(function(name) {
        var task = require('./tasks/' + name).bind(this, rootDir);
        if(task.deps) {
            gulp.task(name, task.deps, task.work);
        } else {
            gulp.task(name, task);
        }
    });

    return gulp;
};