/* global __WEBPACK__ */
// only load style when using webpack
if (__WEBPACK__) {
    require('./style/style.scss');
}

if (__DEBUG__) {
    console.log('yeah');
}

const foo = x;

//noinspection JSAnnotator
export default foo;
