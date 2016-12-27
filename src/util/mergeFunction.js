var _ = require('lodash');

module.exports = function(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.concat(objValue, srcValue);
    }
};
