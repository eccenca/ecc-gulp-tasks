/* eslint no-var: 0 */
/* eslint camelcase: ["error", {properties: "never"}] */
/*eslint-env node, mocha */


var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var webpackBuildCB = require('../util/webpackBuildCB');

module.exports = function(config, callback) {
    var wpConfig = config.webpackConfig.application;
    // use production optimizations
    var optimizations = [
        definePlugin,
        // Set React to production mode
        // (http://ianobermiller.com/blog/2015/06/15/shave-45kb-off-your-production-webpack-react-build/)
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: '"production"'},
            '__DEBUG__': false
        }),
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
    ];

    if (config.momentLocales) {
        var momentLocales = new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, config.momentLocales);
        optimizations.unshift(momentLocales);
    }

    if (config.html) {

        var HtmlWebpackPlugin = require('html-webpack-plugin');
        var HTMLTemplatePlugin = require('../util/HTMLTemplatePlugin');

        config.html.inject = false;

        optimizations.push(new HTMLTemplatePlugin());
        optimizations.push(new HtmlWebpackPlugin(config.html));

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
