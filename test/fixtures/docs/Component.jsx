var React = require('react');

/**
 * General component description.
 */
var Component = React.createClass({
    propTypes: {
        /**
         * Description of prop "foo".
         */
        foo: React.PropTypes.number.isRequired,
        /**
         * Description of prop "bar" (a custom validation function).
         */
        bar: function(props, propName, componentName) {
            // ...
        },
        /**
         * Description of union
         */
        baz: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]),
    },

    getDefaultProps: function() {
        return {
            foo: 42,
            baz: 21
        };
    },

    /**
     * Example method
     * @param id {string} - identifier of something
     */
    event(id) {
    this.setState({id});
    },

    render: function() {
        // ...
    }
});

module.exports = Component;
