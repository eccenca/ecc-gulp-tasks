/* jshint node:true */
var express = require('express');

// configure server
var server = express();

module.exports = function(rootDir) {
    // prepare
    server.use(express.static(rootDir + '/ui-test'));
    server.use('/node_modules', express.static(rootDir + '/node_modules'));
    // start nodemon
    return server.listen(8080);
};
