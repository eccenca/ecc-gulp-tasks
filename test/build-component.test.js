var build = require('../src/tasks/build');

var fs = require('fs');
var path = require('path');

var should = require('should');
var jsdiff = require('diff');
var del = require('del');

var _ = require('lodash');

var componentPath = path.resolve(path.join(__dirname, './fixtures/component'));
var outputPath = path.join(componentPath, 'es5');
var fixturesPath = path.join(componentPath, 'es5_fixtures');

describe('building component', function() {

    afterEach(function(done) {
        del([path.join(outputPath, '**')]).then(function() {
            done();
        });
    });

    describe('should work and produce', function() {

        beforeEach(function(done) {
            // Increase timeout because webpack may take longer
            this.timeout(10000);
            runComponentBuild('./index-working.jsx', done);
        });

        it('the correct javascript (component.js)', function(done) {

            var assertionFile = path.join(fixturesPath, 'component.js');
            var generatedFile = path.join(outputPath, 'component.js');
            compareFiles(assertionFile, generatedFile);
            done();
        });

        it('the correct styles (style.css)', function(done) {

            var assertionFile = path.join(fixturesPath, 'style.css');
            var generatedFile = path.join(outputPath, 'style.css');
            compareFiles(assertionFile, generatedFile);
            done();
        });

    });

    describe('should fail', function() {

        it('if case sensitivity does not match on import', function(done) {
            this.timeout(10000);
            runComponentBuild('./index-case-sensitivity-require.js', function(err) {
                should(err).be.an.Error(err)
                    .and.have.property('message')
                    .which.is.a.String()
                    .and.match(/ForceCaseSensitivityPlugin.+does not match the corresponding file on disk/);
                done();
            });
        });

        it('if case sensitivity does not match on require', function(done) {
            this.timeout(10000);
            runComponentBuild('./index-case-sensitivity-require.js', function(err) {
                should(err).be.an.Error(err)
                    .and.have.property('message')
                    .which.is.a.String()
                    .and.match(/ForceCaseSensitivityPlugin.+does not match the corresponding file on disk/);
                done();
            });
        });

    });

});

/**
 *
 * Index file which should be used for build
 *
 * @param indexFile index file
 * @param callback function to be called after buil
 */
function runComponentBuild(indexFile, callback) {

    var applyApplicationDefaults = require('../src/util/webpack-app.defaults');

    var config = {};

    // Get Config Object for a component
    _.set(config, 'webpackConfig.production', applyApplicationDefaults({
        context: componentPath,
        entry: path.join(componentPath, indexFile),
        output: {
            path: outputPath,
            filename: 'component.js',
            libraryTarget: 'commonjs2',
        },
        resolve: {
            root: componentPath,
        },
    }));

    build(config, callback);
}

/**
 * Compares a generated file against an existing assertion file
 *
 * @param assertionFile path of file the generated file should be compared against
 * @param generatedFile path of generated file
 */
function compareFiles(assertionFile, generatedFile) {
    var oldFileContent = fs.readFileSync(assertionFile).toString();
    var newFileContent = fs.readFileSync(generatedFile).toString();

    var diff = jsdiff.diffLines(oldFileContent, newFileContent, {ignoreWhitespace: true, newlineIsToken: true});

    var hasChanges = false;

    diff.forEach(function(part) {
        if (part.added || part.removed) {
            hasChanges = true;
        }
    });

    if (hasChanges) {
        diff = jsdiff.createTwoFilesPatch(assertionFile, generatedFile, oldFileContent, newFileContent);
        console.warn(diff);
        fs.writeFileSync(path.join(fixturesPath, 'failed-' + (new Date).getTime().toString() + '-' + path.basename(assertionFile)), newFileContent);
        throw new Error('Files do not match (see above for div)');
    }

}
