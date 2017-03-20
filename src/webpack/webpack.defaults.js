const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const {cssLoader, postCssLoader, styleLoader} = require('./webpack-loaderSettings');

module.exports = (config) => {

    return {
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
                'node_modules',
                path.join(config.context, 'node_modules'),
            ],
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
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: styleLoader(),
                        use: [
                            cssLoader(),
                            postCssLoader()
                        ]
                    }),
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: styleLoader(),
                        use: [
                            cssLoader(),
                            postCssLoader(),
                            'sass-loader'
                        ]
                    }),
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-runtime'],
                            presets: ['eccenca']
                        }
                },
                {
                    test: /\.(woff\d?|ttf|eot)(\?.+)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'fonts/[name].[ext]?[hash:5]',
                        }
                },
                {
                    test: /\.(svg|png|jpe?g|gif|ico)(\?.+)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'image/[name].[ext]?[hash:5]',
                        }
                },
            ]
        }
    }
};
