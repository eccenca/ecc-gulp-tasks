const noop = function(config, callback) {
    callback(null, null);
};

noop.deps = ['docs-react'];

module.exports = noop;
