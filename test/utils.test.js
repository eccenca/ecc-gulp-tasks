const should = require('should');
const {isEccenca, isExternal} = require('../src/webpack/utils');
const _ = require('lodash');

describe('webpack.utils', () => {
    it('should categorize external and eccenca packages correctly', () => {
        const modules = require('./fixtures/modules.json');

        _.forEach(modules, data => {
            const comparison = {
                isEccenca: isEccenca(data),
                isExternal: isExternal(data),
                isNotString: !_.isString(data.userRequest),
            };

            if (data.userRequest) {
                comparison.userRequest = data.userRequest;
            }

            should(data).eql(comparison);
        });
    });
});
