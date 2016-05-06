var should = require('should');
var build = require('../tasks/build');

var jsdiff = require('diff');

var fs = require('fs');
var path = require('path');


describe('build', function() {

    var config;

    before(function(done) {
        var applyApplicationDefaults = require('../util/webpack-app.defaults');

        config = require('./project/buildConfig');

        if (config.webpackConfig.production) {
            config.webpackConfig.production = applyApplicationDefaults(config.webpackConfig.production);
        }

        build(config, done);
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
