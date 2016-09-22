/* eslint no-var: 0 */
/* eslint camelcase: ["error", {properties: "never"}] */
/*eslint-env node, mocha */

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
var webpackBuildCB = require('../util/webpackBuildCB');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(config, callback) {

    var wpConfig = config.webpackConfig.application;
    // use production optimizations

    var browsers = _.get(wpConfig, 'browsers', []);

    var optimizations = [
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
                autoprefixer: {add: true, browsers: browsers},
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: process.env.NODE_ENV !== 'test'
        }),
    ];

    if (wpConfig.html) {

        var HtmlWebpackPlugin = require('html-webpack-plugin');
        var HTMLTemplatePlugin = require('../util/HTMLTemplatePlugin');

        wpConfig.html.inject = false;

        optimizations.push(new HTMLTemplatePlugin());
        optimizations.push(new HtmlWebpackPlugin(wpConfig.html));

    }

    if(wpConfig.copyFiles) {

        var CopyWebpackPlugin = require('copy-webpack-plugin');

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
