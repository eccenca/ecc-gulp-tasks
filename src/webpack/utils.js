const _ = require('lodash');
const upath = require('upath');

function mergeFunction(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.concat(objValue, srcValue);
    }
    return undefined;
}

const isJS = userRequest =>
    _.endsWith(userRequest, '.js') || _.endsWith(userRequest, '.jsx');

const isEccenca = module => {
    let userRequest = module.userRequest;

    if (!_.isString(userRequest) || !isJS(userRequest)) {
        return false;
    }

    userRequest = upath.toUnix(userRequest);

    return (
        userRequest.lastIndexOf('node_modules/ecc-') >= 0 &&
        userRequest.lastIndexOf('node_modules/ecc-') ===
            userRequest.lastIndexOf('node_modules')
    );
};

const isExternal = module => {
    let userRequest = module.userRequest;

    if (!_.isString(userRequest) || !isJS(userRequest) || isEccenca(module)) {
        return false;
    }

    userRequest = upath.toUnix(userRequest);

    return (
        userRequest.indexOf('bower_components') >= 0 ||
        userRequest.indexOf('node_modules') >= 0 ||
        userRequest.indexOf('libraries') >= 0
    );
};

module.exports = {
    mergeFunction,
    isEccenca,
    isExternal,
};
