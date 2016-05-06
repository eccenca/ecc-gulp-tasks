/* eslint no-var: 0 */

var gutil = require('gulp-util');

module.exports = function webpackBuildCB(gulpCallback, err, stats) {

    if (err) {
        gulpCallback(new gutil.PluginError('webpack', err));
        return;
    }

    var ret = stats.toString({
        children: false,
        chunks: false,
        colors: true,
        modules: false,
        timings: true,
    });

    if (stats.hasErrors()) {
        gulpCallback(new gutil.PluginError('webpack', ret));
        return;
    }
    if (process.env.NODE_ENV !== 'test') {
        gutil.log('[webpack]: ', ret);
    }
    gulpCallback();
};
