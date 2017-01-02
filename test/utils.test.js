var should = require('should');
var {isEccenca, isExternal} = require('../src/webpack/utils');
var _ = require('lodash')

describe('webpack.utils', function() {

    it('should categorize external and eccenca packages correctly', () => {

        var modules = require('./fixtures/modules.json');

        _.forEach(modules, (data) => {

            const comparison = {
                isEccenca: isEccenca(data),
                isExternal: isExternal(data),
                isNotString: !_.isString(data.userRequest),
            };

            if(data.userRequest){
                comparison.userRequest = data.userRequest;
            }

            should(data).eql(comparison);

        });

    });

});
