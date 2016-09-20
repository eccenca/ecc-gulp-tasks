/* eslint no-var: 0 */

var path = require('path');
var ConcatSource = require("webpack-core/lib/ConcatSource");

function BannerPlugin(outputPath, outputFileName, styleSCSS) {
    this.banner = '// This is necessary so that components may use variables in scss\n' +
        'if(__WEBPACK__){\n' +
        '  require(\'' + path.relative(outputPath, styleSCSS) + '\');\n' +
        '}';
    this.filename = path.basename(outputFileName);
}

module.exports = BannerPlugin;

BannerPlugin.prototype.apply = function(compiler) {
    var banner = this.banner;
    var filename = this.filename;

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
            chunks.forEach(function(chunk) {
                chunk.files
                    .filter(function(file) {
                        return file === filename;
                    })
                    .forEach(function(file) {
                        compilation.assets[file] = new ConcatSource(banner, "\n", compilation.assets[file]);
                    });
            });
            callback();
        });

    });
};
