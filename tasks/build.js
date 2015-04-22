var gutil = require('gulp-util');
var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');

module.exports = function(config, callback) {
    var wpConfig = config.webpackConfig.production;
    // use production optimizations
    var optimizations = [
        definePlugin,
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
    ];
    if (wpConfig.plugins) {
        wpConfig.plugins = wpConfig.plugins.concat(optimizations);
    } else {
        wpConfig.plugins = optimizations;
    }
    // run webpack
    webpack(wpConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString());
        callback();
    });
};
