const webpack = require('webpack');

let version = 'VERSION';

if (process.env.GT_BUILD_VERSION) {
    version = process.env.GT_BUILD_VERSION;
    console.log('VERSION: ' + version);
} else {
    try {
        const execSync = require('child_process').execSync;
        version = execSync('git describe --always --dirty').toString();
        console.log('VERSION: ' + version);
    } catch (e) {
        // we die gracefully, as git errored, or something
    }
}


// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
const definePlugin = new webpack.DefinePlugin({
    __WEBPACK__: true, // say we're the webpack
    __DEV__: process.env.BUILD_DEV, // dev environment indication
    __VERSION__: JSON.stringify(version),
});

module.exports = definePlugin;
