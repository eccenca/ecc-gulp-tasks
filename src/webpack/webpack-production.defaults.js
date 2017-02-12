const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const {mergeFunction} = require('./utils');

const ignored = [];

const isExternalPackage = (context, request, callback) => {
    if (_.includes(ignored, request)) {
        return callback(null, 'commonjs ' + request);
    }

    if (
        _.startsWith(request, './') ||
        _.startsWith(request, '../') ||
        _.startsWith(request, '/') ||
        _.includes(request, '!')
    ) {
        return callback();

    }

    ignored.push(request);

    if (process.env.NODE_ENV !== 'test') {
        console.log('Not including ' + request + ' in build');
    }

    return callback(null, 'commonjs ' + request);
};

const applyDefaults = function(common, cfg) {

    const config = _.mergeWith({}, common, cfg, mergeFunction);

    // This ensures that requires like mdl are added at the top of the header
    const cssInsert = (config.debug) ? 'top' : 'bottom';

    const cssLoader = 'css?-minimize!postcss?pack=cleaner';

    const urlLoader = 'url?limit=10000';

    const fileName = '[name].[ext]?[hash:5]';

    const imageLoader = urlLoader + '&name=image/' + fileName;

    const fontLoader = urlLoader + '&name=fonts/' + fileName;

    // extend config
    const defaults = {
        resolveLoader: {
            moduleExtensions: ["-loader"]
        },
        resolve: {
            mainFields: [
                'style',
                'es5',
                'webpack',
                'browserify',
                'main'
            ],
            extensions: ['.js', '.jsx'],
            modules: [
                config.context,
                path.join(config.context, 'node_modules'),
                'node_modules'
            ],
            alias: {
                // fix for broken RxJS requiring by webpack
                // TODO: remove once fixed in webpack
                rx: 'rx/dist/rx.all.js'
            }
        },
        externals: [
            isExternalPackage
        ],
        node: {
            fs: 'empty',
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader),
                },
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader + '!less'),
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader + '!sass'),
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
        postcss() {
            return {
                defaults: [autoprefixer],
                cleaner: [autoprefixer({add: false, browsers: []})],
            };
        },
    };

    return _.mergeWith(defaults, config, mergeFunction);
};

module.exports = applyDefaults;
