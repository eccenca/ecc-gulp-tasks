/* global __WEBPACK__, React*/
// only load style when using webpack
if (__WEBPACK__) {
    require('./style/style.scss');
}

var _ = require('lodash');
import camelCase from 'lodash/camelCase';

console.log(_, camelCase, Promise);

if (__DEBUG__) {
    console.log('yeah');
}

export default ({
    render(){
        return <div>TestComponent</div>
    }
});
