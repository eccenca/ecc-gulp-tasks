const should = require('should');
const path = require('path');
const badmdl = require('../src/tasks/bad-mdl');

describe('bad-mdl', () => {
    it('should find bad mdl patterns', done => {
        function callback(err, result) {
            should(result).deepEqual({
                'mdl-button': 2,
                'mdl-card': 3,
                'material-icons': 1,
            });
            should(err).equal(null);

            done();
        }

        badmdl(
            {
                checkForBadMDL: path.join(
                    __dirname,
                    'fixtures/bad-mdl/*.{js,jsx,scss}'
                ),
            },
            callback
        );
    });

    it('should work with no bad mdl pattern', done => {
        function callback(err, result) {
            should(result).deepEqual({});
            should(err).equal(null);

            done();
        }

        badmdl(
            {
                checkForBadMDL: path.join(__dirname, '../gulpfile.js'),
            },
            callback
        );
    });
});
