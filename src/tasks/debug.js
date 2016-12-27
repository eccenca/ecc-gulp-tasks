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
    ];

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
