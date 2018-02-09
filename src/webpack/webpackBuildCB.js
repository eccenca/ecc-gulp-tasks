const helpers = require('../util/helpers');

module.exports = function webpackBuildCB(gulpCallback, err, stats) {
    if (err) {
        gulpCallback(new helpers.PluginError('webpack', err));
        return;
    }

    const ret = stats.toString({
        children: false,
        chunks: false,
        colors: true,
        modules: false,
        timings: true,
    });

    if (stats.hasErrors()) {
        gulpCallback(new helpers.PluginError('webpack', ret));
        return;
    }
    if (process.env.NODE_ENV !== 'test') {
        helpers.log('[webpack]: ', ret);
    }
    gulpCallback();
};
