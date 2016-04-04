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
        util.log('Try to start webserver on localhost:' + port);
        serverInstance = server.listen(port);
        serverInstance.on('error', function(err) {
            util.log(
                'Error while starting webserver on localhost:' + port + '.',
                util.colors.red(err.code)
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
                'Started webserver on',
                util.colors.green('localhost:' + port)
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
    // apply overrides if any are present
    if (config.serverOverrides) {
        config.serverOverrides(server, express);
    }
    // server rest as default
    server.get('*', function(req, res) {
        res.sendFile('/index.html', {root: path});
    });

    // start nodemon
    var serverInstance = serverGetInstance(serverPorts);

    // apply server start override if present
    if (config.serverStart) {
        config.serverStart(serverInstance);
    }

    return serverInstance;
};
