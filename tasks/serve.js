/* jshint node:true */
var express = require('express');

// configure server
var server = express();

module.exports = function(rootDir, config) {
    // prepare
    server.use(express.static(rootDir + '/ui-test'));
    server.use('/node_modules', express.static(rootDir + '/node_modules'));

    // apply overrides if any are present
    if (config.serverOverrides) {
        config.serverOverrides(server);
    }

    // start nodemon
    return server.listen(8080);
};
