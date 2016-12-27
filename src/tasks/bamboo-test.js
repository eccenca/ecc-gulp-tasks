/* eslint no-var: 0 */

var util = require('gulp-util');
var test = require('./test');

/**
 * @deprecated
 */
module.exports = function(config) {

    util.log(
        util.colors.yellow('[DEPRECATION WARNING]'),
        'You used the gulp `bamboo-test` task. Please use `test` instead.'
    );

    return test(config);

};
