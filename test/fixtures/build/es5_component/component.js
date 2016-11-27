// This is necessary so that components may use variables in scss
if(__WEBPACK__){
    require('../style/style.scss');
}
module.exports =
    /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};

    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {

        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId])
        /******/ 			return installedModules[moduleId].exports;

        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			exports: {},
            /******/ 			id: moduleId,
            /******/ 			loaded: false
            /******/ 		};

        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ 		// Flag the module as loaded
        /******/ 		module.loaded = true;

        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
/************************************************************************/
/******/ ([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

        'use strict';

        exports.__esModule = true;

        var _promise = __webpack_require__(1);

        var _promise2 = _interopRequireDefault(_promise);

        var _camelCase = __webpack_require__(2);

        var _camelCase2 = _interopRequireDefault(_camelCase);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /* global __WEBPACK__, React*/
        // only load style when using webpack
        if (true) {
            __webpack_require__(3);
        }

        var _ = __webpack_require__(7);


        console.log(_, _camelCase2.default, _promise2.default);

        if (__DEBUG__) {
            console.log('yeah');
        }

        exports.default = {
            render: function render() {
                return React.createElement(
                    'div',
                    null,
                    'TestComponent'
                );
            }
        };
        module.exports = exports['default'];

        /***/ },
    /* 1 */
    /***/ function(module, exports) {

        module.exports = require("babel-runtime/core-js/promise");

        /***/ },
    /* 2 */
    /***/ function(module, exports) {

        module.exports = require("lodash/camelCase");

        /***/ },
    /* 3 */
    /***/ function(module, exports) {

        // removed by extract-text-webpack-plugin

        /***/ },
    /* 4 */,
    /* 5 */,
    /* 6 */,
    /* 7 */
    /***/ function(module, exports) {

        module.exports = require("lodash");

        /***/ }
    /******/ ]);
