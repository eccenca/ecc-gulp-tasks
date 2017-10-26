const noop = function(config, callback) {
    callback(null, null);
};

noop.deps = ['docs-react', 'docs-channels'];

module.exports = noop;
