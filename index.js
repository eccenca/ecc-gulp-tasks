var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var applyDefaults = require('./src/util/webpack-debug.defaults');
var applyApplicationDefaults = require('./src/util/webpack-app.defaults');
var applyProductionDefaults = require('./src/util/webpack-production.defaults');

// get all tasks
var tasksPath = path.join(__dirname, 'src', 'tasks');
var allTasks = fs.readdirSync(tasksPath).map(function(file) { return file.replace('.js', ''); });

// logic
module.exports = function(config) {
    // default config to object
    config = config || {};
    var common = config.webpackConfig.common || {};

    // extend config
    if (config.webpackConfig) {
        if (config.webpackConfig.debug) {
            config.webpackConfig.debug = applyDefaults(common, config.webpackConfig.debug);
        }
        if (config.webpackConfig.production) {
            config.webpackConfig.production = applyProductionDefaults(common, config.webpackConfig.production);
        }
        if (config.webpackConfig.application) {
            config.webpackConfig.application = applyApplicationDefaults(common, config.webpackConfig.application);
        }
    }
    // process tasks
    allTasks.forEach(function(name) {
        var task = require(path.join(tasksPath, name));
        if (task.deps) {
            gulp.task(name, task.deps, task.work.bind(this, config));
        } else {
            gulp.task(name, task.bind(this, config));
        }
    });

    return gulp;
};
