var React = require('react');
var PropTypes = require('prop-types');

/**
 * General component description.
 */
class FutureComponent extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'FutureComponent';
    }
    static propTypes = {
        /**
         * Description of prop "foo".
         */
        foo: PropTypes.number.isRequired,
    };

    static defaultProps = {
        foo: 42,
    };

    render() {
        // ...
    }
}

module.exports = FutureComponent;
