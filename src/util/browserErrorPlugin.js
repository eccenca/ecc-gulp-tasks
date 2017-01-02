const path = require('path');

const BrowserErrorPlugin = function() {};
BrowserErrorPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function(stats) {
        if (stats.hasErrors()) {
            const nonLinterErrors = stats.compilation.errors.filter(function(err) {
                return err &&
                    err.module &&
                    err.module.issuer &&
                    err.module.issuer.indexOf('eslint-loader') === -1;
            });
            if (nonLinterErrors.length) {
                const outputFileSystem = compiler.outputFileSystem;
                const outputOptions = compiler.options.output;
                const main = path.join(outputOptions.path, outputOptions.filename);
                const errors = nonLinterErrors.map(function(err) {
                    let msg = '';
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
