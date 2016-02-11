function HTMLTemplatePlugin() {}

module.exports = HTMLTemplatePlugin;

HTMLTemplatePlugin.prototype.apply = function(compiler) {

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {

            htmlPluginData.html = htmlPluginData.html
                .replace(/<script.*?src=".+?\.js".*?>(<\/script>)?/g, '')
                .replace(/<link.*?href=".+?\.css".*?>/g, '');

            console.warn(htmlPluginData.html);

            callback();
        });
    });
};
