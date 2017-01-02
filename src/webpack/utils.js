const _ = require('lodash');
const slash = require('slash');

function mergeFunction(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.concat(objValue, srcValue);
    }
}

const isEccenca = (module) => {
    let userRequest = module.userRequest;

    if (!_.isString(userRequest)) {
        return false;
    }

    userRequest = slash(userRequest);

    return userRequest.lastIndexOf('node_modules/ecc-') >= 0 &&
        userRequest.lastIndexOf('node_modules/ecc-') === userRequest.lastIndexOf('node_modules');
};

const isExternal = (module) => {
    let userRequest = module.userRequest;

    if (!_.isString(userRequest) || isEccenca(module)) {
        return false;
    }

    userRequest = slash(userRequest);

    return userRequest.indexOf('bower_components') >= 0 ||
        userRequest.indexOf('node_modules') >= 0 ||
        userRequest.indexOf('libraries') >= 0;
};

module.exports = {
    mergeFunction,
    isEccenca,
    isExternal
};
