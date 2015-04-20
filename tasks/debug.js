var gutil = require('gulp-util');
var webpack = require('webpack');

module.exports = function(config) {
    var wpConfig = config.webpackConfig.debug;
    // run webpack
    var compiler = webpack(wpConfig);
    compiler.watch(200, function(err, stats) {
        if (err) {
            gutil.log('[webpack-error]', err.toString());
            return;
        }
        // log result
        gutil.log('[webpack]', stats.toString());
    });
};
