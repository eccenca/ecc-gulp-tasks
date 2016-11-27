/* eslint no-var: 0 */
var path = require('path');

var BrowserErrorPlugin = function() {};
BrowserErrorPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function(stats) {
        if (stats.hasErrors()) {
            var nonLinterErrors = stats.compilation.errors.filter(function(err) {
                return err &&
                    err.module &&
                    err.module.issuer &&
                    err.module.issuer.indexOf('eslint-loader') === -1;
            });
            if (nonLinterErrors.length) {
                var outputFileSystem = compiler.outputFileSystem;
                var outputOptions = compiler.options.output;
                var main = path.join(outputOptions.path, outputOptions.filename);
                var errors = nonLinterErrors.map(function(err) {
                    var msg = '';
                    if (typeof err.error === 'string') {
                        msg = err.error;
                    } else {
                        msg = err.error.message;
                    }
                    return msg.replace(/\n/g, '\\n').replace(/'/g, '\\\'');
                }).join('\n\n');
                outputFileSystem.writeFile(main, 'throw new Error(\'' + errors + '\')');
            }
        }
    });
};

module.exports = BrowserErrorPlugin;
