/* global __WEBPACK__, React*/
// only load style when using webpack
if (__WEBPACK__) {
    require('./style/style.scss');
}

if (__DEBUG__) {
    console.log('yeah');
}

export default ({
    render(){
        return <div>TestComponent</div>
    }
});
