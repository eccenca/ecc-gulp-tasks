/* eslint func-style: 0 */

const _ = require('lodash');

const cssTemplate = _.template('    <link rel="stylesheet" type="text/css" href="${styleSheet}">\n');

/**
 * @deprecated
 * @constructor
 */
function HTMLTemplatePlugin() {}

HTMLTemplatePlugin.prototype.apply = function(compiler) {

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {

            // Remove all style tags from file
            htmlPluginData.html = htmlPluginData.html
                .replace(/^\s*<link.*?href=".+?\.css".*?>\s*\r?\n?/gm, '');

            const chunks = _.get(htmlPluginData, 'assets.chunks', []);

            _.forEach(chunks, function(chunk, name) {

                // Replace script tags that have a matching chunk name
                const search = new RegExp('(<script.*?src=")' + name + '\.js(".*?>(<\/script>)?)', 'g');
                htmlPluginData.html = htmlPluginData.html
                    .replace(search, '$1' + chunk.entry + '$2');

                // Add style tags if chunks contain styles
                const css = _.get(chunk, 'css', []);
                _.forEach(css, function(file) {
                    htmlPluginData.html = htmlPluginData.html
                        .replace(/(<\/head>)/, cssTemplate({styleSheet: file}) + '$1');
                });
            });

            callback();
        });
    });
};

module.exports = HTMLTemplatePlugin;
