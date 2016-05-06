/* eslint no-var: 0 */
/* eslint no-console: 0 */
/* eslint max-params: 0 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

module.exports = function(config, callback) {
    // executes `pwd`
    exec('git describe --always --dirty', function(error, stdout, stderr) {
        if (error !== null) {
            console.error('exec error: ' + error, '\nstd err: ' + stderr);
        }

        var v = stdout.replace(/[\n\t\r]/g, '');
        fs.writeFile(path.join(config.rootPath, 'version.json'), JSON.stringify({version: v}), function(err) {
            if (err) {
                console.error(err);
            }

            callback();
        });
    });
};
