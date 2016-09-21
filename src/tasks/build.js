/* eslint no-var: 0 */

var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
var webpackBuildCB = require('../util/webpackBuildCB');
var SCSSBannerPlugin = require('../util/SCSSBannerPlugin');

module.exports = function(config, callback) {

    var wpConfig = config.webpackConfig.production;

    // use production optimizations
    var optimizations = [
        definePlugin,
        new ExtractTextPlugin('style.css'),
        new ForceCaseSensitivityPlugin(),
    ];

    var styleSCSS = path.join(config.webpackConfig.production.context, 'style', 'style.scss');

    if (fs.existsSync(styleSCSS)) {

        var outputPath = config.webpackConfig.production.output.path;
        var outputFileName = config.webpackConfig.production.output.filename;

        optimizations.push(
            new SCSSBannerPlugin(outputPath, outputFileName, styleSCSS)
        );
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
