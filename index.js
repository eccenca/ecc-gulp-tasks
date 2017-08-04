const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const applyDefaults = require('./src/webpack/webpack-debug.defaults.js');
const applyApplicationDefaults = require('./src/webpack/webpack-app.defaults.js');
const applyProductionDefaults = require('./src/webpack/webpack-production.defaults.js');

// get all tasks
const tasksPath = path.join(__dirname, 'src', 'tasks');
const allTasks = fs.readdirSync(tasksPath).map(file => file.replace('.js', ''));

// logic
module.exports = function createBuildConfig(config) {
    // default config to object
    const currentConfig = config || {};
    const common = currentConfig.webpackConfig.common || {};

    // extend config
    if (currentConfig.webpackConfig) {
        if (currentConfig.webpackConfig.debug) {
            currentConfig.webpackConfig.debug = applyDefaults(
                common,
                currentConfig.webpackConfig.debug
            );
        }
        if (currentConfig.webpackConfig.production) {
            currentConfig.webpackConfig.production = applyProductionDefaults(
                common,
                currentConfig.webpackConfig.production
            );
        }
        if (currentConfig.webpackConfig.application) {
            currentConfig.webpackConfig.application = applyApplicationDefaults(
                common,
                currentConfig.webpackConfig.application
            );
        }
    }

    // process tasks
    allTasks.forEach(function getTask(name) {
        // eslint-disable-next-line
        const task = require(path.join(tasksPath, name));
        if (task.deps) {
            gulp.task(name, task.deps, task.bind(this, currentConfig));
        } else {
            gulp.task(name, task.bind(this, currentConfig));
        }
    });

    return gulp;
};
