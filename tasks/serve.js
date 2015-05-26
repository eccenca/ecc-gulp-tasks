var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configure server
var server = express();

module.exports = function(config) {
    var path = config.path;
    // parse request bodies (req.body)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // support _method (PUT in forms etc)
    app.use(methodOverride());
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
    return server.listen(8080);
};
