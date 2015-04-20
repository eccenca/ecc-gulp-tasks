/* jshint node:true */
var express = require('express');

// configure server
var server = express();

module.exports = function(config) {
    var path = config.path;
    var rootDir = config.rootDir;
    // prepare
    server.use(express.static(path));
    server.use('/node_modules', express.static(rootDir + '/node_modules'));

    // apply overrides if any are present
    if (config.serverOverrides) {
        config.serverOverrides(server);
    }

    // start nodemon
    return server.listen(8080);
};
