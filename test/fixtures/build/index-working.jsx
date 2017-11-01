/* global __WEBPACK__, React*/
// only load style when using webpack
if (__WEBPACK__) {
    require('./style/style.scss');
}

const _ = require('ecc-test');
import camelCase from 'lodash/camelCase';

const json = require('./example.json');

console.log(_, camelCase, Promise, json);

if (__DEBUG__) {
    console.log('yeah');
}

export default ({
    render(){
        return <div>TestComponent</div>
    }
});
