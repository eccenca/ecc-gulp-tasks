const fs = require('fs-extra');
const path = require('upath');

const _ = require('lodash');
const {mergeFunction} = require('./utils');

const webpackDefaults = require('./webpack.defaults');

const ignored = [];

const isExternalPackage = (context, request, callback) => {
    if (_.includes(ignored, request)) {
        return callback(null, `commonjs ${request}`);
    }

    const fullPath = path.isAbsolute(request)
        ? request
        : path.joinSafe(context, request);

    if (fs.existsSync(fullPath) || _.includes(request, '!')) {
        return callback();
    }

    ignored.push(request);

    if (process.env.NODE_ENV !== 'test') {
        console.log(`Not including ${request} in build`);
    }

    return callback(null, `commonjs ${request}`);
};

const applyDefaults = function(common, cfg) {
    const config = _.mergeWith({}, common, cfg, mergeFunction);

    // extend config
    const defaults = {
        externals: [isExternalPackage],
    };

    return _.mergeWith(
        webpackDefaults(config),
        defaults,
        config,
        mergeFunction
    );
};

module.exports = applyDefaults;
