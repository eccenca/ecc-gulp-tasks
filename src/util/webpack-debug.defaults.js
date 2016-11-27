/* eslint no-var: 0 */

var path = require('path');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');


var applyDefaults = function(common, cfg) {

    var config = _.mergeWith({}, common, cfg, function(a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    });

    // This ensures that requires like mdl are added at the top of the header
    var cssInsert = (config.debug) ? 'top' : 'bottom';

    var cssLoaders = [
        'style?insertAt=' + cssInsert,
        'css?-minimize',
        'postcss'].join('!');

    var urlLoader = 'url?limit=200000';

    // extend config
    return _.mergeWith({}, config, {
        devtool: 'inline-source-map',
        debug: true,
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
                    loader: urlLoader + '&mimetype=application/font-woff',
                },
                {
                    test: /\.ttf(\?.+)?$/,
                    loader: urlLoader + '&mimetype=application/octet-stream',
                },
                {
                    test: /\.eot(\?.+)?$/,
                    loader: urlLoader + '&mimetype=application/vnd.ms-fontobject',
                },
                {
                    test: /\.svg(\?.+)?$/,
                    loader: urlLoader + '&mimetype=image/svg+xml',
                },
                {
                    test: /\.png$/,
                    loader: urlLoader + '&mimetype=image/png',
                },
                {
                    test: /\.jpe?g$/,
                    loader: urlLoader + '&mimetype=image/jpeg',
                },
                {
                    test: /\.gif$/,
                    loader: urlLoader + '&mimetype=image/gif',
                },
                {
                    test: /\.ico$/,
                    loader: urlLoader + '&mimetype=image/x-icon',
                },
            ],
        },
        postcss: function() {
            return {
                defaults: [autoprefixer],
                cleaner:  [autoprefixer({ browsers: [] })],
            };
        },
    }, function(a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    });
};

module.exports = applyDefaults;
