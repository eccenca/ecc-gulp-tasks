const gutil = require('gulp-util');
const webpack = require('webpack');
const definePlugin = require('../util/definePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
const BrowserErrorPlugin = require('../util/browserErrorPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');
const chalk = gutil.colors;
const webpackStatsToString = require('webpack/lib/Stats').jsonToString;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const serve = require('../util/serve');
const path = require('path');

const isEccenca = (module) => {
    const userRequest = module.userRequest;

    if (typeof userRequest !== 'string') {
        return false;
    }

    return userRequest.lastIndexOf('ecc-') >= 0 &&
        userRequest.lastIndexOf('node_modules/ecc-') === userRequest.lastIndexOf('node_modules');
};

const isExternal = (module) => {
    const userRequest = module.userRequest;

    if (typeof userRequest !== 'string' || isEccenca(module)) {
        return false;
    }

    return userRequest.indexOf('bower_components') >= 0 ||
        userRequest.indexOf('node_modules') >= 0 ||
        userRequest.indexOf('libraries') >= 0;
};

const statsToString = (stats, firstRun) => {

    const statsJson = stats.toJson({
        hash: false,
        version: firstRun,
        timings: true,
        assets: true,
        chunks: false,
        children: false,
    }, true);

    statsJson.assets = _.filter(statsJson.assets, (asset) => {
        return asset.emitted || /\.(js|html)/.test(asset.name);
    });

    return (webpackStatsToString(statsJson, true));

};

const debug = (config) => {
    const wpConfig = config.webpackConfig.debug;

    wpConfig.output.path = path.join(wpConfig.context, '.tmp');

    gutil.log(chalk.cyan('[webpack]'), 'Started initial build (this make some time)');

    // use production optimizations
    const optimizations = [
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
                minChunks(module) {
                    return isEccenca(module);
                }
            })
        );
        optimizations.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendors',
                filename: 'vendor.js',
                chunks: ['main', 'eccenca'],
                minChunks(module) {
                    return isExternal(module);
                }
            })
        );
    }

    if (wpConfig.copyFiles) {

        const CopyWebpackPlugin = require('copy-webpack-plugin');

        optimizations.push(new CopyWebpackPlugin(wpConfig.copyFiles));

    }

    optimizations.push(new HtmlWebpackPlugin(wpConfig.html));

    if (wpConfig.plugins) {
        wpConfig.plugins = wpConfig.plugins.concat(optimizations);
    } else {
        wpConfig.plugins = optimizations;
    }

    let firstRun = true;

    // run webpack
    const compiler = webpack(wpConfig);
    compiler.watch(200, function(err, stats) {

        if (err) {
            gutil.log(chalk.red('[webpack-error]'), err.toString());
            return;
        }

        gutil.log(chalk.cyan('[webpack]'), statsToString(stats, firstRun));

        if (firstRun) {
            //callback();
            gutil.log(chalk.cyan('[webpack]'), 'Finished initial build');
            serve({path: wpConfig.output.path});
            firstRun = false;
        }

    });
};

debug.deps = ['doctor'];

module.exports = debug;
