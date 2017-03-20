const path = require('path');
const _ = require('lodash');
const {mergeFunction} = require('./utils');

const webpackDefaults = require('./webpack.defaults');

const applyDefaults = function(common, cfg) {

    const config = _.mergeWith({}, common, cfg, mergeFunction);

    // extend config
    const defaults = {
        devtool: 'cheap-module-eval-source-map',
        html: {
            template: path.join(__dirname, 'assets', 'component.html.ejs'),
            chunksSortMode: 'id',
        },
    };

    return _.mergeWith(webpackDefaults(config), defaults, config, mergeFunction);
};

module.exports = applyDefaults;
