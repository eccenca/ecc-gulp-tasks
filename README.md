# Eccenca common gulp tasks (ecc-gulp-tasks)

A set of common gulp tasks for front-end development

## Available tasks

- `build` - compiles optimized (minified, deduped) commonjs version of your component with webpack. Uses `config.webpackConfig.production` as basic configuration.
- `build-app` - compiles optimized (minified, deduped) application with webpack. Uses `config.webpackConfig.application` as basic configuration.
- `debug` - compiles debug version of your component with webpack, watches for changes and re-compiles when needed (until interrupted). Uses `config.webpackConfig.debug` as basic configuration.
- `serve` - uses express.js to statically serve folder specified in `config.path` at `localhost:8080`. Servers `index.html` for all non-existent requests to allow client-side routing testing. Allows access to express.js app via `config.serverOverrides(app)` function.
- `test` - runs mocha tests starting from file specified at `config.testEntryPoint`.
- `bamboo-test` - runs mocha tests starting from file specified at `config.testEntryPoint` and generates output with [bamboo-mocha-reporter](https://www.npmjs.com/package/mocha-bamboo-reporter).
- `cover` - runs istanbul to generate test coverage from file specified at `config.testEntryPoint`.
- `lint` - runs eslint on files specified at `config.lintingFiles`.
- `version` - generates a `version.json` file using git describe command.
- `licenses` **deprecated** - generates `licenses.json` file using all currently installed packages.
- `licenses-yaml2json` - generates a `licenses.json` from a `licenses.yaml` file.

## Usage

- Include into your project using `npm i --save-dev ecc-gulp-tasks`
- Create `gulpfile.js` looks like this:

```js
var gulp = require('ecc-gulp-tasks')(require('./buildConfig.js'));

gulp.task('default', ['debug', 'serve']);
```

As you can see, you need to provide two arguments while requiring the package.
First one is an array of string names of available tasks you wish to use.
The second one is your build config (described below).

### Adding custom gulp tassk

If you need to use your custom gulp tasks after including common ones, you can do it like so:

```js
var gulp = require('ecc-gulp-tasks')(/* ... */);
// define task inline
gulp.task('my-task', function() {
    // ...
});
// load your custom tasks from external file
require('./gulp/my-other-task.js')(gulp);
// ...
```

### How to run things synchonously?

Normally gulp runs everything asynchronously, but sometimes you might want to run tasks in sync.
That is useful for example if you want to generate a version and licenses files before compiling the app itself.
To do that, you can use [gulp-sequence](https://github.com/teambition/gulp-sequence) package, like so:

```js
var gulpSequence = require('gulp-sequence');
var gulp = require('ecc-gulp-tasks')(/* ... */);
// ....
gulp.task('deploy', gulpSequence('version', 'licenses', 'build'));
```

### Build config

Example build config looks like this:

```js
var path = require('path');
module.exports = {
    path: path.resolve(__dirname),
    testEntryPoint: path.join(__dirname, 'test', 'index.jsx'),
    rootPath: path.resolve(__dirname),
    webpackConfig: {
        debug: require('./webpack.config.js'),
        production: require('./webpack.config.prod.js'),
        application: require('./webpack.config.app.js'),
    },
    serverOverrides: function(app, express) {
        app.use(express.static(path.join(__dirname, 'dist')));
    },
    serverStart: function(server) {
        startSocketServer(server);
    },
    licenseReport: {
        input: path.resolve(__dirname, 'license-report.yaml'),
        outputName: 'licenses.json',
        outputPath: path.resolve(__dirname, 'dist')
    },
    momentLocales: /(de|en).js/
};
```

Exported parameters are as follows:

- `path` - should point to directory you want to serve (used in `serve` task)
- `testEntryPoint` - should point to your test entry point (to be run by mocha)
- `rootPath` - should point to root of your project directory, usually can be copy-pasted from example (used in `licenses` and `version` tasks)
- `webpackConfig.debug` - should include your webpack config used for debugging
- `webpackConfig.production` - should include your webpack config used for compilation for production
- `webpackConfig.application` - should include your webpack config used for compilation as production application
- `serverOverrides` - should contain a function that can be used to override defaults from `serve` task
- `serverStart` - should contain function that can be used to start something on top of server instance (e.g. websocket server)
- `licenseReport` - should point to a license yaml file and contain parameters for the generated license report
- `momentLocales` - a regex which matches the locales for `moment.js`. Webpack includes all locales by default. By setting this parameter, the build size can be reduced a lot.

### Javascript flags

There are two Javascript flags set:

`__WEBPACK__` is set to true while using `gulp build|build-app|debug`.
This may be used for doing things only webpack can do, like requiring style sheets, etc:

```
if(__WEBPACK__){
  require('./style.css')
}
```

`__DEBUG__` is set to `true` during `gulp debug`.
If you run `gulp build-app`, `__DEBUG__` is set to `false`, effectively stripping all debug statements.
This may be used for doing things only during development:

```
// The following block will only be run during development
if(__DEBUG__){
  console.info('Dear Developer, have a nice day')
}
```
