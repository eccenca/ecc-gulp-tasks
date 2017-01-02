const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const definePlugin = require('../util/definePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForceCaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
const webpackBuildCB = require('../util/webpackBuildCB');
const SCSSBannerPlugin = require('../util/SCSSBannerPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const _ = require('lodash');

module.exports = function(config, callback) {

    const wpConfig = config.webpackConfig.production;

    // use production optimizations
    const optimizations = [
        new CleanWebpackPlugin([path.basename(wpConfig.output.path)], {
            root: path.dirname(wpConfig.output.path),
            verbose: process.env.NODE_ENV !== 'test',
        }),
        definePlugin,
        new ForceCaseSensitivityPlugin(),
    ];

    if (_.isPlainObject(wpConfig.entry)) {
        optimizations.push(new ExtractTextPlugin('[name].css'));
    } else {
        optimizations.push(new ExtractTextPlugin('component.css'));
    }

    const styleSCSS = path.join(wpConfig.context, 'style', 'style.scss');

    if (fs.existsSync(styleSCSS)) {

        const outputPath = wpConfig.output.path;
        const outputFileName = wpConfig.output.filename;

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
