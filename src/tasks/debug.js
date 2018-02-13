const helpers = require('../util/helpers');
const webpack = require('webpack');
const definePlugin = require('../webpack/plugins/definePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
const BrowserErrorPlugin = require('../webpack/plugins/browserErrorPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');

const chalk = helpers.colors;
const webpackStatsToString = require('webpack/lib/Stats').jsonToString;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const serve = require('../util/serve');
const path = require('upath');
const Doctor = require('../util/doctor');
const {isEccenca, isExternal} = require('../webpack/utils');

const statsToString = (stats, firstRun) => {
    const statsJson = stats.toJson(
        {
            hash: false,
            version: firstRun,
            timings: true,
            assets: true,
            chunks: false,
            children: false,
        },
        true
    );

    statsJson.assets = _.filter(
        statsJson.assets,
        asset => asset.emitted || /\.(js|html)/.test(asset.name)
    );

    return webpackStatsToString(statsJson, true);
};

const debug = (config, callback) => {
    const wpConfig = config.webpackConfig.debug;

    Doctor.asyncSelfCheck({
        dir: wpConfig.context,
        logger: helpers.log.bind(null, helpers.colors.yellow('[WARNING]:')),
    });

    wpConfig.output.path = path.joinSafe(wpConfig.context, '.tmp');

    helpers.log(
        chalk.cyan('[webpack]'),
        'Started initial build (this make some time)'
    );

    // use production optimizations
    const optimizations = [
        new CleanWebpackPlugin([path.basename(wpConfig.output.path)], {
            root: path.dirname(wpConfig.output.path),
            verbose: process.env.NODE_ENV !== 'test',
        }),
        definePlugin,
        new webpack.DefinePlugin({
            __DEBUG__: true,
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /~$/),
        new BrowserErrorPlugin(),
        new ForceCaseSensitivityPlugin(),
        // Old debug option. Should be removed in webpack 3
        // FIXME: Check if necessary
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
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
                },
            })
        );
        optimizations.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendors',
                filename: 'vendor.js',
                chunks: ['main', 'eccenca'],
                minChunks(module) {
                    return isExternal(module);
                },
            })
        );
    }

    optimizations.push(
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true,
            disable: false,
        })
    );

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

    // remove custom parameters
    delete wpConfig.copyFiles;
    delete wpConfig.html;
    delete wpConfig.browsers;
    delete wpConfig.debug;

    // run webpack
    const compiler = webpack(wpConfig);
    compiler.watch(200, (err, stats) => {
        if (err) {
            helpers.log(chalk.red('[webpack-error]'), err.toString());
            return;
        }

        helpers.log(chalk.cyan('[webpack]'), statsToString(stats, firstRun));

        if (firstRun) {
            helpers.log(chalk.cyan('[webpack]'), 'Finished initial build');
            serve({path: wpConfig.output.path, logger: helpers.log});
            firstRun = false;
            callback();
        }
    });
};

debug.deps = ['doctor'];

module.exports = debug;
