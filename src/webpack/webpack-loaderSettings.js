const autoprefixer = require('autoprefixer');

const styleLoader = insertAt => ({
    loader: 'style-loader',
    options: {
        insertAt,
    },
});

const cssLoader = () => ({
    loader: 'css-loader',
    options: {
        minimize: false,
    },
});

const postCssLoader = () => ({
    loader: 'postcss-loader',
    options: {
        plugins() {
            return [autoprefixer({add: false, browsers: []})];
        },
    },
});

module.exports = {
    cssLoader,
    postCssLoader,
    styleLoader,
};
