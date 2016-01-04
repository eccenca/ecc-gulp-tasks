# Eccenca common gulp tasks

Provides basic tasks for all your component needs.

## Upgrading to ^0.16.0

ecc-gulp-tasks 0.16.0 contains breaking changes. Babel was updated to version 6.

If your package uses babel itself (or any babel-\* packages) please make sue you know what you are doing.
 
Good reads are:
- [The Six Things You Need To Know About Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)
- [Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)
- [Quick guide: how to update Babel 5.x -> 6.x](https://medium.com/@malyw/d828c230ec53)

A main think that broke is requiring modules with `require` instead of `import`. If you have problems with that, please read: [Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution](https://medium.com/@kentcdodds/ad2d5ab93ce0) 


### Available tasks

- `build` - compiles optimized (minified, deduped) commonjs version of your component with webpack. Uses `config.webpackConfig.production` as basic configuration.
- `build-app` - compiles optimized (minified, deduped) application with webpack. Uses `config.webpackConfig.application` as basic configuration.
- `debug` - compiles debug version of your component with webpack, watches for changes and re-compiles when needed (until interrupted). Uses `config.webpackConfig.debug` as basic configuration.
- `serve` - uses express.js to statically serve folder specified in `config.path` at `localhost:8080`. Servers `index.html` for all non-existent requests to allow client-side routing testing. Allows access to express.js app via `config.serverOverrides(app)` function.
- `test` - runs mocha tests starting from file specified at `config.testEntryPoint`.
- `bamboo-test` - runs mocha tests starting from file specified at `config.testEntryPoint` and generates output with [bamboo-mocha-reporter](https://www.npmjs.com/package/mocha-bamboo-reporter).
- `cover` - runs istanbul to generate test coverage from file specified at `config.testEntryPoint`.
- `lint` - runs eslint on files specified at `config.lintingFiles`.
- `version` - generates a `version.json` file using git describe command.
- `licenses` - generates `licenses.json` file using all currently installed packages.



### Usage

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
