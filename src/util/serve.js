const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const chalk = require('gulp-util').colors;

// configure server
const server = express();
const serverPorts = [8080, 8081, 8082, 8083, 8084, 8085];
const serverGetInstance = (portsArray, logger) => {
    let serverInstance = false;
    const port = portsArray.shift();

    if (port) {
        logger(
            chalk.cyan('[serve]'),
            `Trying to start webserver on localhost:${port}`
        );
        serverInstance = server.listen(port);
        serverInstance.on('error', err => {
            logger(
                chalk.red('[serve]'),
                `Error while starting webserver on localhost:${port}.`,
                chalk.red(err.toString())
            );
            if (portsArray.length > 0) {
                serverInstance = serverGetInstance(portsArray, logger);
            } else {
                serverInstance.close();
                throw err; // no next port to start webserver
            }
        });
        serverInstance.on('listening', () => {
            logger(
                chalk.cyan('[serve]'),
                'Started webserver on',
                chalk.green(`http://localhost:${port}`)
            );
        });
    }

    return serverInstance;
};

module.exports = ({path, logger = console.log}) => {
    // parse request bodies (req.body)
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true}));
    // support _method (PUT in forms etc)
    server.use(methodOverride());
    // prepare
    server.use(express.static(path));

    // server rest as default
    server.get('*', (req, res) => {
        res.sendFile('/index.html', {root: path});
    });

    // start nodemon
    return serverGetInstance(serverPorts, logger);
};
