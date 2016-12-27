/* eslint no-var: 0 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var util = require('gulp-util');

// configure server
var server = express();
var serverPorts = [8080, 8081, 8082, 8083, 8084, 8085];
var serverGetInstance = function(portsArray) {

    var serverInstance = false;
    var port = 0;

    if ((portsArray.length > 0) && (port = portsArray.shift())) {
        util.log(util.colors.cyan('[serve]'), `Try to start webserver on localhost:${port}`);
        serverInstance = server.listen(port);
        serverInstance.on('error', function(err) {
            util.log(
                util.colors.red('[serve]'),
                `Error while starting webserver on localhost:${port}.`,
                util.colors.red(err.toString())
            );
            if (portsArray.length > 0) {
                serverInstance = serverGetInstance(portsArray);
            }
            else {
                serverInstance.close();
                throw err; // no next port to start webserver
            }
        });
        serverInstance.on('listening', function() {
            util.log(
                util.colors.cyan('[serve]'),
                'Started webserver on',
                util.colors.green(`http://localhost:${port}`)
            );
        });
    }

    return serverInstance;
};

module.exports = function(config) {
    var path = config.path;
    // parse request bodies (req.body)
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true}));
    // support _method (PUT in forms etc)
    server.use(methodOverride());
    // prepare
    server.use(express.static(path));

    // server rest as default
    server.get('*', function(req, res) {
        res.sendFile('/index.html', {root: path});
    });

    // start nodemon
    return serverGetInstance(serverPorts);
};
