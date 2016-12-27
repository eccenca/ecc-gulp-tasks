var util = require('gulp-util');

/**
 * @deprecated
 */
module.exports = function(config, callback) {

    util.log(
        util.colors.yellow('[DEPRECATION WARNING]'),
        'You used the gulp `serve` task. The `debug` task now serves files directly. ' +
        'Please remove references to `serve` from your gulp file.'
    );

    callback();

};
