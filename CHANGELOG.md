# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep A Changelog's Format](http://keepachangelog.com/).

## [3.4.0] 2017-03-20
### Changed

- Upgrade to `webpack@2`
- Upgrade to `node-sass@4.5`

### Removed

- Remove unused `less-loader`

## [3.3.2] 2017-02-15
### Fixed
- Added missing `__BRANCH__` variable

## [3.3.1] 2017-02-09
### Fixed
- Enable `sourceMap` option correctly in uglify js plugin if source maps are enabled via `dev-tool` true

## [3.3.0] 2017-02-08

## Added
- `yaml-loader@0.4.0` to enable parsing of yaml files.

### Fixed
- Spacing in README around code blocks

### Changed
- Updated to `file-loader@0.10.0`, `fs-extra@2.0.0`
- Updated all dependencies (minor and patch updates)

## [3.2.0] 2017-01-25
### Added
- add `--self-check` option for gulp doctor which checks if `ecc-gulp-tasks` and `ecc-dotfiles` are up to date.

### Changed
- moved definitions for tools to json file

## [3.1.2] 2017-01-11
### Fixed
- upgraded `ecc-license-checker`, whoch fixes bugs in `gulp licenses-yaml2json`

## [3.1.1] 2017-01-02
### Fixed
- bug with chunk mapping, where modules sometimes were included into the `eccenca` chunk

## [3.1.0] 2017-01-02

### Deprecated
-   `gulp serve` target. Already removed, as `gulp debug` runs it's own server now.

### Changed
-   Removed `eslint-loader` as it caused OOM errors of node
-   Upgraded dependencies
-   Debug will build into a `.tmp` directory and served from there.

    -   A default `index.html` will be generated which includes all needed assets (js and css).
-   Major Speed Improvements in `gulp debug`:

    -   Downgraded `css-loader`, due to [performance concerns](https://github.com/webpack/css-loader/issues/124)
    -   Removed css cleaning and postprocessing in `gulp debug`
    -   Write big assets like images or fonts into `.tmp` folder
    -   Default devtool is now `cheap-module-eval-source-map` instead of `inline-sourcemap`
    -   Split bundles into multiple, deduped chunks.
        The source code of a component now lives in a different chunk than the vendor scripts.

-   Output of `gulp debug` now displays only changed files & all javascript files
-   `gulp debug` now checks if `ecc-gulp-tasks` and `ecc-dotfiles` are up to date

### Added
-   `copyFiles` option is now also considered in `gulp debug`
-   `gulp doctor` target which checks:

    -   If unnecessary files exist
    -   If package.json contains faulty segments
    -   If build script config contains deprecated config
    -   If yarn, node and npm are up to date

    Some of these points are fixable with running `gulp doctor --heal`

### Removed
-   unused `licenseData.js` util
-   unused `gulp bamboo-test` task
-   unnecessary `gulp serve` task

## [3.0.0] 2016-11-27

### Breaking

Generally upgrading should be possible without any problems, especially in simple components.

-   Update to `gulp-spawn-mocha@3`, brings a few breaking changes: https://github.com/mochajs/mocha/pull/2350
-   removed deprecated `gulp licenses` target.

    Migration: Use the `gulp licenses-yaml2json` target. See README for usage instructions.
-   removed `momentLocales` config parameter.
    By default when building an app NO moment locales are included.

    Migration: Import locales directly in the source code
    ```js
    //es6
    import 'moment/locale/de';

    //es5
    require('moment/locale/de')
    ```
-   removed `gulp version` target

    Migration: Use the `__VERSION__` variable. See README for more details.

### Added
-   `webpackConfig.common` config parameter which allows to set common webpack parameters for production, debug and application
-   `webpackConfig.application` allows the following optional parameters:
    -  `browsers`: a [browserslist](https://github.com/ai/browserslist) definition which is used for css autoprefixing
    -  `copyFiles`: a list of [copy-webpack-plugin](https://github.com/kevlened/copy-webpack-plugin) patterns which is used for copying files to the output folder

### Changed
- Require `ecc-dotfiles@1.6.0` as a peer dependency which brings gitlab merge request templates
- `gulp build` and `gulp build-app` clean the output folders
- Update to `force-case-sensitivity-plugin@0.2` which now also errors on wrong casing of folders
- Updated dependencies to `css-loader@0.25` and `postcss-loader@0.13`
- Updated dev dependencies to `diff@3` and `should@11`

### Fixed
- `gulp build` does not include subfolder paths of node_modules (like `import 'lodash/camelCase'`) into the bundle anymore.
- `gulp build` now properly minifies css bundles with the `optimize-css-assets-webpack-plugin`

### Removed
- unused `rootPath` config parameter
- included `.eslintrc` rules. The config file which is specified for the source file will be used.

## [2.5.0] 2016-09-05
### Added
- `lib` subfolders are now ignored for `eslint` during development
- normally webpack pulls in all locales for `moment.js`. A `momentLocales` parameter has been added to the buildConfig. This parameter takes an regex which evaluates which locales will be pulled in.

### Removed
- `reduce-css-calc` dependency, as the issue has been resolved upstream

## [2.4.3] 2016-08-22
### Changed
- Added `http://` to serve task, so that it can be opened in the browser per click

### Fixed
- Added `reduce-css-calc@1.2.4` as a dependecy, as `1.2.5` broke stuff: https://github.com/MoOx/reduce-css-calc/issues/13

## [2.4.2] 2016-07-25
### Fixed
- Updated eslint jsdoc rule regarding void functions

## [2.4.1] 2016-07-25
### Fixed
- Updated eslint rule regarding jsdoc

## [2.4.0] 2016-07-21
### Added
- `gulp lint` target for linting gulp-tasks file

### Changed
- now using `eslint@3`
- updated webpack loaders: `sass-loader` and `file-loader`

## [2.3.0] 2016-06-23
### Added
- Added `__DEBUG__` Flag which is set to true while running `gulp debug`.
`gulp build-app` will strip all `__DEBUG__` flags while `gulp build` leaves them be.

### Changed
- Refactored tests around building of components

## [2.2.0] 2016-06-20
### Added
- Case Sensitivity Check during Builds to prevent failing builds from case insensitive file systems.

## [v2.1.0] - 2016-05-24

### Added
- Added `licenses-yaml2json` target for converting license YAML files to license json files

### Deprecated
- `licenses` target should be replaced with newly added `licenses-yaml2json`
