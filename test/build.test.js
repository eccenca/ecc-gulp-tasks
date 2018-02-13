const build = require('../src/tasks/build');
const buildApp = require('../src/tasks/build-app');

const fs = require('fs');
const path = require('upath');

const should = require('should');
const jsdiff = require('diff');
const del = require('del');

const _ = require('lodash');

const componentPath = path.resolve(
    path.joinSafe(__dirname, './fixtures/build')
);
const outputPath = path.joinSafe(componentPath, 'es5');
const fixturesPath = path.joinSafe(componentPath, 'es5_component');

const appFixturesPath = path.joinSafe(componentPath, 'es5_app');

/**
 *
 * Index file which should be used for build
 *
 * @param indexFile index file
 * @param callback function to be called after buil
 */
function runComponentBuild(indexFile, callback) {
    const applyApplicationDefaults = require('../src/webpack/webpack-production.defaults.js');

    const config = {};

    // Get Config Object for a component
    _.set(
        config,
        'webpackConfig.production',
        applyApplicationDefaults({
            context: componentPath,
            entry: path.joinSafe(componentPath, indexFile),
            output: {
                path: outputPath,
                filename: 'component.js',
                libraryTarget: 'commonjs2',
            },
        })
    );

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
    const applyApplicationDefaults = require('../src/webpack/webpack-app.defaults.js');

    const config = {};

    // Get Config Object for a component
    _.set(
        config,
        'webpackConfig.application',
        applyApplicationDefaults({
            minify: false,
            context: componentPath,
            entry: {
                main: path.joinSafe(componentPath, indexFile),
            },
            output: {
                path: outputPath,
                filename: '[name].js?[chunkhash:5]',
            },
            resolve: {
                alias: {
                    'babel-runtime/core-js/promise': './empty-module.js',
                    'lodash/camelCase': './empty-module.js',
                    lodash: './empty-module.js',
                },
            },
            browsers: ['ie >= 9'],
            html: {
                template: 'index.html.ejs',
            },
            copyFiles: [{from: './index.html.ejs', to: './copy'}],
        })
    );

    buildApp(config, callback);
}

/**
 * Compares a generated file against an existing assertion file
 *
 * @param assertionFile path of file the generated file should be compared against
 * @param generatedFile path of generated file
 */
function compareFiles(assertionFile, generatedFile) {
    const oldFileContent = fs.readFileSync(assertionFile).toString();
    let newFileContent = fs.readFileSync(generatedFile).toString();

    newFileContent = newFileContent.replace(/\r\n/g, '\n').replace(/\r/, '\n');

    let diff = jsdiff.diffLines(oldFileContent, newFileContent, {
        ignoreWhitespace: true,
        newlineIsToken: true,
    });

    let hasChanges = false;

    diff.forEach(part => {
        if (part.added || part.removed) {
            hasChanges = true;
        }
    });

    if (hasChanges) {
        diff = jsdiff.createTwoFilesPatch(
            assertionFile,
            generatedFile,
            oldFileContent,
            newFileContent
        );
        console.warn(diff);
        fs.writeFileSync(
            path.joinSafe(
                path.dirname(assertionFile),
                `failed-${new Date().getTime().toString()}-${path.basename(
                    assertionFile
                )}`
            ),
            newFileContent
        );
        throw new Error('Files do not match (see above for diff)');
    }
}

describe('building', () => {
    afterEach(done => {
        del([path.joinSafe(outputPath, '**')]).then(() => {
            done();
        });
    });

    describe('app', () => {
        describe('should work and produce', () => {
            beforeEach(function setTimeout(done) {
                // Increase timeout because webpack may take longer
                this.timeout(10000);
                runAppBuild('./index-working.jsx', done);
            });

            it('the correct javascript (main.js)', done => {
                const assertionFile = path.joinSafe(appFixturesPath, 'main.js');
                const generatedFile = path.joinSafe(outputPath, 'main.js');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct styles (style.css)', done => {
                const assertionFile = path.joinSafe(
                    appFixturesPath,
                    'style.css'
                );
                const generatedFile = path.joinSafe(outputPath, 'style.css');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct html (index.html)', done => {
                const assertionFile = path.joinSafe(
                    appFixturesPath,
                    'index.html'
                );
                const generatedFile = path.joinSafe(outputPath, 'index.html');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct copied html (copy/index.html)', done => {
                const assertionFile = path.joinSafe(
                    appFixturesPath,
                    'copy/index.html.ejs'
                );
                const generatedFile = path.joinSafe(
                    outputPath,
                    'copy/index.html.ejs'
                );
                compareFiles(assertionFile, generatedFile);
                done();
            });
        });
    });

    describe('component', () => {
        describe('should work and produce', () => {
            beforeEach(function setTimeout(done) {
                // Increase timeout because webpack may take longer
                this.timeout(10000);
                runComponentBuild('./index-working.jsx', done);
            });

            it('the correct javascript (component.js)', done => {
                const assertionFile = path.joinSafe(
                    fixturesPath,
                    'component.js'
                );
                const generatedFile = path.joinSafe(outputPath, 'component.js');
                compareFiles(assertionFile, generatedFile);
                done();
            });

            it('the correct styles (component.css)', done => {
                const assertionFile = path.joinSafe(
                    fixturesPath,
                    'component.css'
                );
                const generatedFile = path.joinSafe(
                    outputPath,
                    'component.css'
                );
                compareFiles(assertionFile, generatedFile);
                done();
            });
        });

        describe('should fail', () => {
            it('if case sensitivity does not match on import', function test(done) {
                this.timeout(10000);
                runComponentBuild(
                    './index-case-sensitivity-require.js',
                    err => {
                        should(err)
                            .be.an.Error()
                            .and.have.property('message')
                            .which.is.a.String()
                            .and.match(
                                /CaseSensitivePathsPlugin.+does not match the corresponding path on disk/
                            );
                        done();
                    }
                );
            });

            it('if case sensitivity does not match on require', function test(done) {
                this.timeout(10000);
                runComponentBuild(
                    './index-case-sensitivity-require.js',
                    err => {
                        should(err)
                            .be.an.Error()
                            .and.have.property('message')
                            .which.is.a.String()
                            .and.match(
                                /CaseSensitivePathsPlugin.+does not match the corresponding path on disk/
                            );
                        done();
                    }
                );
            });
        });
    });
});
