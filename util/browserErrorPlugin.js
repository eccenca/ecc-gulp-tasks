/* eslint no-var: 0 */
var path = require('path');

var BrowserErrorPlugin = function() {};
BrowserErrorPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function(stats) {
        if (stats.hasErrors()) {
            var outputFileSystem = compiler.outputFileSystem;
            var outputOptions = compiler.options.output;
            var main = path.join(outputOptions.path, outputOptions.filename);
            var errors = stats.toString({
                hash: false,
                version: false,
                timings: false,
                assets: false,
                chunks: false,
                chunkModules: false,
                modules: false,
                cached: false,
                reasons: false,
                source: false,
                errorDetails: true,
                chunkOrigins: false,
                modulesSort: false,
                chunksSort: false,
                assetsSort: false
            }).replace(/\n/g, '\\n');
            outputFileSystem.writeFile(main, 'throw new Error(\'' + errors.replace(/'/g, '\\\'') + '\')');
        }
    });
};

module.exports = BrowserErrorPlugin;
