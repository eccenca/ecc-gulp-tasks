const should = require('should');
const lint = require('../src/tasks/lint');

describe('eslint', () => {
    it('should fail with an invalid js file', done => {
        const stream = lint({
            lintingFiles: ['./test/fixtures/lint/fail.js'],
        });

        stream.on('error', err => {
            should(() => {
                throw err;
            }).throw(/Unexpected var/);
            done();
        });
    });

    it('should not fail with a valid js file', done => {
        const stream = lint({
            lintingFiles: ['./test/fixtures/lint/good.js'],
        });

        stream.on('end', done);

        stream.on('data', () => {});
    });
});
