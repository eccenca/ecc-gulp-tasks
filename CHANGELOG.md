# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep A Changelog's Format](http://keepachangelog.com/).

## [Unreleased]

### Breaking
- Update to `gulp-spawn-mocha@3`, brings a few breaking changes: https://github.com/mochajs/mocha/pull/2350
- removed deprecated `gulp licenses` target

### Changed
- Require `ecc-dotfiles@1.6.0` as a peer dependency which brings gitlab merge request templates
- Update to `force-case-sensitivity-plugin@0.2` which now also errors on wrong casing of folders
- Updated dependencies to `css-loader@0.25` and `postcss-loader@0.13` 
- Updated dev dependencies to `diff@3` and `should@11`

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
