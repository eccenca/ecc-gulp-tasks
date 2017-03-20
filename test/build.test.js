var build = require('../src/tasks/build');
var buildApp = require('../src/tasks/build-app');

var fs = require('fs');
var path = require('path');

var should = require('should');
var jsdiff = require('diff');
var del = require('del');

var _ = require('lodash');

var componentPath = path.resolve(path.join(__dirname, './fixtures/build'));
var outputPath = path.join(componentPath, 'es5');
var fixturesPath = path.join(componentPath, 'es5_component');

var appFixturesPath = path.join(componentPath, 'es5_app');


describe('building', function() {

    afterEach(function(done) {
        del([path.join(outputPath, '**')]).then(function() {
            done();
        });
    });

    describe('app', function() {
        describe('should work and produce', function() {

            beforeEach(function(done) {
                // Increase timeout because webpack may take longer
                this.timeout(10000);
                runAppBuild('./index-working.jsx', done);
            });

            it('the correct javascript (main.js)', function(done) {

                var assertionFile = path.join(appFixturesPath, 'main.js');
                var generatedFile = path.join(outputPath, 'main.js');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct styles (style.css)', function(done) {

                var assertionFile = path.join(appFixturesPath, 'style.css');
                var generatedFile = path.join(outputPath, 'style.css');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct html (index.html)', function(done) {

                var assertionFile = path.join(appFixturesPath, 'index.html');
                var generatedFile = path.join(outputPath, 'index.html');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct copied html (copy/index.html)', function(done) {

                var assertionFile = path.join(appFixturesPath, 'copy/index.html.ejs');
                var generatedFile = path.join(outputPath, 'copy/index.html.ejs');
                compareFiles(assertionFile, generatedFile);
                done();
            });

        });
    });

    describe('component', function() {

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

            it('the correct styles (component.css)', function(done) {

                var assertionFile = path.join(fixturesPath, 'component.css');
                var generatedFile = path.join(outputPath, 'component.css');
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
                        .and.match(/CaseSensitivePathsPlugin.+does not match the corresponding path on disk/);
                    done();
                });
            });

            it('if case sensitivity does not match on require', function(done) {
                this.timeout(10000);
                runComponentBuild('./index-case-sensitivity-require.js', function(err) {
                    should(err).be.an.Error(err)
                        .and.have.property('message')
                        .which.is.a.String()
                        .and.match(/CaseSensitivePathsPlugin.+does not match the corresponding path on disk/);
                    done();
                });
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

    var applyApplicationDefaults = require('../src/webpack/webpack-production.defaults.js');

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
    }));

    build(config, callback);
}

/**
 *
 * Index file which should be used for build
 *
 * @param indexFile index file
 * @param callback function to be called after buil
 */
function runAppBuild(indexFile, callback) {

    var applyApplicationDefaults = require('../src/webpack/webpack-app.defaults.js');

    var config = {};

    // Get Config Object for a component
    _.set(config, 'webpackConfig.application', applyApplicationDefaults({
        context: componentPath,
        entry: {
            main: path.join(componentPath, indexFile)
        },
        output: {
            path: outputPath,
            filename: '[name].js?[chunkhash:5]',
        },
        resolve: {
            alias: {
                'babel-runtime/core-js/promise': './empty-module.js',
                'lodash/camelCase': './empty-module.js',
                'lodash': './empty-module.js',
            }
        },
        browsers: [
            'ie >= 9'
        ],
        html: {
            template: 'index.html.ejs'
        },
        copyFiles: [
            { from: './index.html.ejs', to: './copy' }
        ]
    }));

    buildApp(config, callback);
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
        fs.writeFileSync(path.join(path.dirname(assertionFile), 'failed-' + (new Date).getTime().toString() + '-' + path.basename(assertionFile)), newFileContent);
        throw new Error('Files do not match (see above for diff)');
    }

}
