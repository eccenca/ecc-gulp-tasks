var should = require('should');
var lint = require('../tasks/lint');

describe('eslint', function() {
    
    it('should fail with an invalid js file', function(done) {
        var stream = lint({
            lintingFiles: [
                './test/fixtures/lint/fail.js'
            ]
        });

        stream.on('error', function(err) {
            (function() {
                throw err
            }).should.throw(/Unexpected var/);
            done();
        })
    });

    it('should not fail with a valid js file', function(done) {
        var stream = lint({
            lintingFiles: [
                './test/fixtures/lint/good.js'
            ]
        });

        stream.on('end', done);

        stream.on('data', function(){});

    });

});
