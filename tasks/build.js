/* eslint no-var: 0 */
var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var webpackBuildCB = require('../util/webpackBuildCB');

module.exports = function(config, callback) {

    var wpConfig = config.webpackConfig.production;

    // use production optimizations
    var optimizations = [
        definePlugin,
    ];
    if (wpConfig.plugins) {
        wpConfig.plugins = wpConfig.plugins.concat(optimizations);
    } else {
        wpConfig.plugins = optimizations;
    }

    // remove linting
    delete wpConfig.module.preLoaders;

    // run webpack
    webpack(wpConfig, webpackBuildCB.bind(undefined, callback));
};
