var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var applyDefaults = require('./util/webpack.defaults');
var applyApplicationDefaults = require('./util/webpack-app.defaults');

// get all tasks
var tasksPath = path.join(__dirname, 'tasks');
var allTasks = fs.readdirSync(tasksPath).map(function(file) { return file.replace('.js', ''); });

// logic
module.exports = function(config) {
    // default config to object
    config = config || {};
    // extend config
    if (config.webpackConfig) {
        if (config.webpackConfig.debug) {
            config.webpackConfig.debug = applyDefaults(config.webpackConfig.debug);
        }
        if (config.webpackConfig.production) {
            config.webpackConfig.production = applyApplicationDefaults(config.webpackConfig.production);
        }
        if (config.webpackConfig.application) {
            config.webpackConfig.application = applyApplicationDefaults(config.webpackConfig.application);
        }
    }
    // process tasks
    allTasks.forEach(function(name) {
        var task = require('./tasks/' + name);
        if (task.deps) {
            gulp.task(name, task.deps, task.work.bind(this, config));
        } else {
            gulp.task(name, task.bind(this, config));
        }
    });

    return gulp;
};
