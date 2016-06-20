var should = require('should');
var build = require('../tasks/build');

var jsdiff = require('diff');

var fs = require('fs');
var path = require('path');


describe('build', function() {

    describe('working build', function() {

        var config;

        before(function(done) {
            // Increase timeout because webpack may take longer
            this.timeout(10000);
            config = buildWrapper('./index-working.js', done);
        });

        it('webpack should produce the correct component.js', function(done) {

            var assertionFile = path.join(config.webpackConfig.production.context, 'es5_result', 'component.js');
            var generatedFile = path.join(config.webpackConfig.production.context, 'es5', 'component.js');
            compareFiles(assertionFile, generatedFile);
            done();
        });

        it('webpack should produce the correct style.css', function(done) {

            var assertionFile = path.join(config.webpackConfig.production.context, 'es5_result', 'style.css');
            var generatedFile = path.join(config.webpackConfig.production.context, 'es5', 'style.css');
            compareFiles(assertionFile, generatedFile);
            done();
        });

    });

    describe('failing builds', function() {

        it('webpack should throw an error if case sensivity does not match the correct component.js', function(done) {
            this.timeout(10000);
            buildWrapper('./index-case-sensivity-check.js', function(err) {
                should(err).be.an.Error(err)
                    .and.have.property('message')
                    .which.is.a.String()
                    .and.match(/ForceCaseSensitivityPlugin.+does not match the corresponding file on disk/);
                done();
            });

        });

    });

});


function buildWrapper(indexFile, callback) {

    var applyApplicationDefaults = require('../util/webpack-app.defaults');

    var config = require('./project/buildConfig');

    if (config.webpackConfig.production) {
        config.webpackConfig.production.entry = indexFile;
        config.webpackConfig.production = applyApplicationDefaults(config.webpackConfig.production);
    }

    build(config, callback);

    return config;
}

function compareFiles(oldFile, newFile) {
    var oldFileContent = fs.readFileSync(oldFile).toString();
    var newFileContent = fs.readFileSync(newFile).toString();

    var diff = jsdiff.diffLines(oldFileContent, newFileContent, {ignoreWhitespace: true, newlineIsToken: true});

    var hasChanges = false;

    diff.forEach(function(part) {
        if (part.added || part.removed) {
            hasChanges = true;
        }
    });

    if (hasChanges) {
        diff = jsdiff.createTwoFilesPatch(oldFile, newFile, oldFileContent, newFileContent);
        console.warn(diff);
        throw new Error('Files do not match (see above for div)');
    }

}
