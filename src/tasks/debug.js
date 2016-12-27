/* eslint no-var: 0 */

var gutil = require('gulp-util');
var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
var BrowserErrorPlugin = require('../util/browserErrorPlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var chalk = gutil.colors;
var CleanWebpackPlugin = require('clean-webpack-plugin');
var serve = require('./serve');
var path = require('path');

function isExternal(module) {
    var userRequest = module.userRequest;

    if (typeof userRequest !== 'string' || isEccenca(module)) {
        return false;
    }

    var r = userRequest.indexOf('bower_components') >= 0 ||
        userRequest.indexOf('node_modules') >= 0 ||
        userRequest.indexOf('libraries') >= 0;

    return r;
}

function isEccenca(module) {
    var userRequest = module.userRequest;

    if (typeof userRequest !== 'string') {
        return false;
    }

    return userRequest.lastIndexOf('ecc-') >= 0 && userRequest.lastIndexOf('node_modules/ecc-') === userRequest.lastIndexOf('node_modules')
}


module.exports = function(config) {
    var wpConfig = config.webpackConfig.debug;

    wpConfig.output.path = path.join(wpConfig.context, '.tmp')

    gutil.log(chalk.cyan('[webpack]'), 'Started initial build (this make some time)');

    // use production optimizations
    var optimizations = [
        new CleanWebpackPlugin([path.basename(wpConfig.output.path)], {
            root: path.dirname(wpConfig.output.path),
            verbose: process.env.NODE_ENV !== 'test',
        }),
        definePlugin,
        new webpack.DefinePlugin({
            __DEBUG__: true
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /~$/),
        new ExtractTextPlugin('style.css'),
        new BrowserErrorPlugin(),
        new ForceCaseSensitivityPlugin(),
        new webpack.optimize.DedupePlugin(),
    ];

    if (_.isString(wpConfig.entry)) {
        wpConfig.entry = {
            main: wpConfig.entry,
        };
    }

    if (_.isPlainObject(wpConfig.entry) && wpConfig.entry.main) {
        optimizations.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'eccenca',
                filename: 'eccenca.js',
                chunks: ['main'],
                minChunks: function(module) {
                    return isEccenca(module);
                }
            })
        );
        optimizations.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendors',
                filename: 'vendor.js',
                chunks: ['main', 'eccenca'],
                minChunks: function(module) {
                    return isExternal(module);
                }
            })
        );
    }

    optimizations.push(new HtmlWebpackPlugin(wpConfig.html));

    if (wpConfig.plugins) {
        wpConfig.plugins = wpConfig.plugins.concat(optimizations);
    } else {
        wpConfig.plugins = optimizations;
    }

    var firstRun = true;

    // run webpack
    var compiler = webpack(wpConfig);
    compiler.watch(200, function(err, stats) {

        if (err) {
            gutil.log(chalk.red('[webpack-error]'), err.toString());
            return;
        }
        // log result
        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true,
        }));

        if (firstRun) {
            //callback();
            gutil.log(chalk.cyan('[webpack]'), 'Finished initial build');
            serve({path: wpConfig.output.path});
            firstRun = false;
        }

    });
};
