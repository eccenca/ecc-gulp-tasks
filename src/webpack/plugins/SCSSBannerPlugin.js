/* eslint func-style: 0 */
const upath = require('upath');
const ConcatSource = require('webpack-sources').ConcatSource;

function SCSSBannerPlugin(outputPath, outputFileName, styleSCSS) {
    this.path = upath.toUnix(upath.relative(outputPath, styleSCSS));
    this.banner = `// This is necessary so that components may use variables in scss
if(__WEBPACK__){
  require('${this.path}');
}`;
    this.filename = upath.basename(outputFileName);
}

module.exports = SCSSBannerPlugin;

SCSSBannerPlugin.prototype.apply = function(compiler) {
    const banner = this.banner;
    const filename = this.filename;

    compiler.plugin('compilation', compilation => {
        compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
            chunks.forEach(chunk => {
                chunk.files.filter(file => file === filename).forEach(file => {
                    // eslint-disable-next-line no-param-reassign
                    compilation.assets[file] = new ConcatSource(
                        banner,
                        '\n',
                        compilation.assets[file]
                    );
                });
            });
            callback();
        });
    });
};
