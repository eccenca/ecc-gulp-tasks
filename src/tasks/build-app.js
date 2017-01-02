/* eslint camelcase: ["error", {properties: "never"}] */
/*eslint-env node, mocha */

const _ = require('lodash');
const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const definePlugin = require('../util/definePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
const webpackBuildCB = require('../util/webpackBuildCB');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(config, callback) {

    const wpConfig = config.webpackConfig.application;
    // use production optimizations

    const compatibleBrowsers = _.get(wpConfig, 'browsers', []);

    const optimizations = [
        new CleanWebpackPlugin([path.basename(wpConfig.output.path)], {
            root: path.dirname(wpConfig.output.path),
            verbose: process.env.NODE_ENV !== 'test',
        }),
        definePlugin,
        // Set React to production mode
        // (http://ianobermiller.com/blog/2015/06/15/shave-45kb-off-your-production-webpack-react-build/)
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: '"production"'},
            '__DEBUG__': false
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /~$/),
        new ExtractTextPlugin('style.css?[contenthash:5]'),
        new ForceCaseSensitivityPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false,
                screw_ie8: true,
            },
            mangle: {
                screw_ie8: true,
            },
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css(\?.+)?$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                autoprefixer: {add: true, browsers: compatibleBrowsers},
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: process.env.NODE_ENV !== 'test'
        }),
    ];

    if (wpConfig.html) {

        const HtmlWebpackPlugin = require('html-webpack-plugin');

        //@deprecated
        if (wpConfig.html.template && /\.html$/.test(wpConfig.html.template)) {

            gutil.log(
                gutil.colors.yellow('[DEPRECATION]'),
                'Please provide an .ejs template for html-webpack plugin and no .html template'
            );

            const HTMLTemplatePlugin = require('../util/HTMLTemplatePlugin');
            wpConfig.html.inject = false;
            optimizations.push(new HTMLTemplatePlugin());
        }

        optimizations.push(new HtmlWebpackPlugin(wpConfig.html));

    }

    if (wpConfig.copyFiles) {

        const CopyWebpackPlugin = require('copy-webpack-plugin');

        optimizations.push(new CopyWebpackPlugin(wpConfig.copyFiles));

    }

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
