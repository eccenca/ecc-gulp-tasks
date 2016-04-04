var gutil = require('gulp-util');

module.exports = function webpackBuildCB(gulpCallback, err, stats){

    if (err) {
        gulpCallback(new gutil.PluginError('webpack', err));
        return;
    }

    var ret = stats.toString({
        chunks: false,
        modules: false,
        colors: true,
    });

    if(stats.hasErrors()){
        gulpCallback(new gutil.PluginError('webpack', ret));
        return;
    }

    gutil.log('[webpack]: ', ret);
    gulpCallback();
};
