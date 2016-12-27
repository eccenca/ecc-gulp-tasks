/* eslint no-var: 0 */

var path = require('path');
var _ = require('lodash');
var mergeFunction = require('./mergeFunction');

var applyDefaults = function(common, cfg) {

    var config = _.mergeWith({}, common, cfg, mergeFunction);

    // This ensures that requires like mdl are added at the top of the header
    var cssInsert = (config.debug) ? 'top' : 'bottom';

    var cssLoaders = [
        'style?insertAt=' + cssInsert,
        'css?-minimize',
    ].join('!');

    var urlLoader = 'url?limit=10000';

    var fileName = '[name].[ext]?[hash:5]';

    var imageLoader = urlLoader + '&name=image/' + fileName;

    var fontLoader = urlLoader + '&name=fonts/' + fileName;


    // extend config
    var defaults = {
        devtool: 'cheap-module-eval-source-map',
        debug: true,
        html: {
            template: path.join(__dirname, 'component.html.ejs')
        },
        resolveLoader: {
            root: path.join(__dirname, '..', 'node_modules'),
            fallback: path.join(__dirname, '..', 'node_modules'),
        },
        resolve: {
            root: config.context,
            packageMains: [
                'style',
                'es5',
                'webpack',
                'browserify',
                'main'
            ],
            extensions: ['', '.js', '.jsx'],
            modulesDirectories: ['node_modules'],
            fallback: path.join(config.context, 'node_modules'),
            alias: {
                // fix for broken RxJS requiring by webpack
                // TODO: remove once fixed in webpack
                rx: 'rx/dist/rx.all.js'
            }
        },
        node: {
            fs: 'empty',
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    exclude: [
                        /node_modules/,
                        path.join(config.context, 'lib'),
                    ],
                    loader: 'eslint-loader'
                },
            ],
            loaders: [
                {
                    test: /\.css$/,
                    loader: cssLoaders,
                },
                {
                    test: /\.less$/,
                    loader: cssLoaders + '!less',
                },
                {
                    test: /\.scss$/,
                    loader: cssLoaders + '!sass',
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                        plugins: ['transform-runtime'],
                        presets: ['eccenca']
                    },
                },
                {
                    test: /\.woff\d?(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/font-woff',
                },
                {
                    test: /\.ttf(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/octet-stream',
                },
                {
                    test: /\.eot(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/vnd.ms-fontobject',
                },
                {
                    test: /\.svg(\?.+)?$/,
                    loader: imageLoader + '&mimetype=image/svg+xml',
                },
                {
                    test: /\.png$/,
                    loader: imageLoader + '&mimetype=image/png',
                },
                {
                    test: /\.jpe?g$/,
                    loader: imageLoader + '&mimetype=image/jpeg',
                },
                {
                    test: /\.gif$/,
                    loader: imageLoader + '&mimetype=image/gif',
                },
                {
                    test: /\.ico$/,
                    loader: imageLoader + '&mimetype=image/x-icon',
                },
            ],
        },
    };

    _.mergeWith(defaults, config, mergeFunction);

    return defaults;
};

module.exports = applyDefaults;
