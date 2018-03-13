# Eccenca common gulp tasks (@eccenca/gulp-tasks)

A set of common gulp tasks for front-end development

## Environment

Simply run `gulp doctor --env` to check whether your environment matches the recommended environment and get installation instructions if not.


## Available tasks

- `bad-mdl` - finds several bad mdl classes. We want to use the ecc-gui-elements instead of using those bad classes directly.
- `build` - compiles optimized (minified, deduped) commonjs version of your component with webpack. Uses `config.webpackConfig.production` as basic configuration.
- `build-app` - compiles optimized (minified, deduped) application with webpack. Uses `config.webpackConfig.application` as basic configuration.
- `debug` - compiles debug version of your component with webpack, watches for changes and re-compiles when needed (until interrupted). Uses `config.webpackConfig.debug` as basic configuration.
- `test` - runs mocha tests starting from file specified at `config.testEntryPoint`.
- `cover` - runs istanbul to generate test coverage from file specified at `config.testEntryPoint`.
- `lint` - runs eslint on files specified at `config.lintingFiles`.
- `licenses-yaml2json` - generates a `licenses.json` from a `licenses.yaml` file.
- `doctor` - runs several checks in the project. Some of them are fixable by running `gulp doctor --heal`
- `docs` creates a README.md from react code and template file

## Usage

- Include into your project using `npm i --save-dev @eccenca/gulp-tasks`
- Create `gulpfile.js` looks like this:

```js
var gulp = require('@eccenca/gulp-tasks')(require('./buildConfig.js'));

gulp.task('default', ['debug', 'serve']);
```

As you can see, you need to provide two arguments while requiring the package.
First one is an array of string names of available tasks you wish to use.
The second one is your build config (described below).

### Adding custom gulp task

If you need to use your custom gulp tasks after including common ones, you can do it like so:

```js
var gulp = require('@eccenca/gulp-tasks')(/* ... */);
// define task inline
gulp.task('my-task', function() {
    // ...
});
// load your custom tasks from external file
require('./gulp/my-other-task.js')(gulp);
// ...
```

### How to run things synchronously?

Normally gulp runs everything asynchronously, but sometimes you might want to run tasks in sync.
That is useful for example if you want to run tests and then build a component.
To do that, you can use [gulp-sequence](https://github.com/teambition/gulp-sequence) package, like so:

```js
var gulpSequence = require('gulp-sequence');
var gulp = require('@eccenca/gulp-tasks')(/* ... */);
// ....
gulp.task('deploy', gulpSequence('test', 'build-app'));
```

### Build config

Example build config looks like this:

```js
var path = require('path');
module.exports = {
    testEntryPoint: path.join(__dirname, 'test', 'index.jsx'),
    webpackConfig: {
        debug: require('./webpack.config.js'),
        production: require('./webpack.config.prod.js'),
        application: require('./webpack.config.app.js'),
        common: {
            context: path.resolve(__dirname),
        },
    },
    licenseReport: {
        input: path.resolve(__dirname, 'license-report.yaml'),
        outputName: 'licenses.json',
        outputPath: path.resolve(__dirname, 'dist')
    },
};
```

Exported parameters are as follows:

- `testEntryPoint` - should point to your test entry point (to be run by mocha)
- `webpackConfig.debug` - should include your webpack config used for debugging
- `webpackConfig.production` - should include your webpack config used for compilation for production
- `webpackConfig.application` - should include your webpack config used for compilation as production application. It allows for the following special parameters:
    -  `browsers`: a [browserslist](https://github.com/ai/browserslist) definition which is used for css autoprefixing
    -  `copyFiles`: a list of [copy-webpack-plugin patterns](https://github.com/kevlened/copy-webpack-plugin#usage)  which is used for copying files to the output folder
    -  `html`: a [html template](https://github.com/ampedandwired/html-webpack-plugin/blob/master/docs/template-option.md) for the [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin#configuration)
- `webpackConfig.common` - may webpack config that `webpackConfig.debug`, `webpackConfig.production` and `webpackConfig.application` have in common
- `licenseReport` - should point to a license yaml file and contain parameters for the generated license report

### Javascript flags

There are the following flags set:

`__WEBPACK__` is set to true while using `gulp build|build-app|debug`.
This may be used for doing things only webpack can do, like requiring style sheets, etc:

```js
if(__WEBPACK__){
  require('./style.css')
}
```

`__DEBUG__` is set to `true` during `gulp debug`.
If you run `gulp build-app`, `__DEBUG__` is set to `false`, effectively stripping all debug statements.
This may be used for doing things only during development:

```js
// The following block will only be run during development
if(__DEBUG__){
  console.info('Dear Developer, have a nice day')
}
```

`__VERSION__` is set to `'VERSION'`

If the environment variable `GT_BUILD_VERSION` is set, `__VERSION__` will be set to that value.
Otherwise it will be set to the result of `git describe --always --dirty`, if that does not fail.

Usage:

```jsx
const version = (<div>{__VERSION__}</div>);
```

### Automated documentation

To use `docs` following rules must be minded:

- Only react components and channels will be generated for now
- Components name must be set explicit with 'displayName'
- channels are ordered by '@publicSubject' and '@privateSubject' which is mandatory

For examples look at `test/fixtures/docs/Store.jsx`
