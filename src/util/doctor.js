const globby = require('globby');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const semver = require('semver');
const cp = require('child_process');

const execSync = cp.execSync;
const textTable = require('text-table');

const CacheService = require('cache-service');
const FileCacheService = require('cache-service-file-cache');

const fileCache = new FileCacheService({
    key: 'crypto-currencies',
    maxRetries: 8,
    defaultExpiration: 200 * 60,
    verbose: false,
});
const cache = new CacheService({verbose: false}, [fileCache]);
const superagentCache = require('superagent-cache-plugin')(cache);
const superagent = require('superagent');

const Ajv = require('ajv');

const ajv = new Ajv({allErrors: true});
ajv.addFormat('semver', value => semver.valid(value) !== null);
ajv.addFormat('prepackage', () => false);
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv.addSchema(require('./schema/package.eccenca.js'), 'package.eccenca');

const nameMap = require('../nameMap');

function isEccencaPackage(p) {
    const search = _.chain(p)
        .pick(['name', 'bugs', 'repository'])
        .map(v => (_.isString(v) ? v : _.values(v).join('|')))
        .join('|')
        .value();

    return /(eccenca|elds)/.test(search);
}

function validatorFn(
    schemaValue,
    dataValue,
    parentSchema,
    dataPath,
    dataParent,
    dataField,
    data
) {
    const templates = _.isArray(schemaValue) ? schemaValue : [schemaValue];

    const anyOf = _.map(templates, t => _.template(t)(data));

    if (_.some(anyOf, templateValue => templateValue === dataValue)) {
        return true;
    }

    const error = {
        keyword: 'template',
        params: {
            template: anyOf,
        },
    };

    error.message =
        _.size(anyOf) > 1
            ? `should be one of "${anyOf.join('", "')}"`
            : `should be "${anyOf[0]}"`;

    validatorFn.errors = [error];

    return false;
}

ajv.addKeyword('template', {
    validate: validatorFn,
    errors: true,
});

ajv.addSchema(
    fs.readJSONSync(path.join(__dirname, 'schema', 'package.json')),
    'package'
);

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
    if (_.isPlainObject(objValue)) {
        return _.mergeWith({}, objValue, srcValue, (a, b) =>
            _.compact(_.flatten([a, b]))
        );
    }
    return undefined;
}

function ajvToMessages(errors, fileName, data) {
    let reduced = _.reduce(
        errors,
        (result, current) => {
            const dataPath = current.dataPath.replace(/^\./, '');
            const key = `${current.keyword}:${dataPath}:${current.schemaPath}`;
            let merged;
            if (_.has(result, key)) {
                merged = _.mergeWith({}, result[key], current, customizer);
            } else {
                merged = _.clone(current);
            }
            _.set(result, [key], merged);
            _.set(result, [key, 'dataPath'], dataPath);
            return result;
        },
        {}
    );

    reduced = _.sortBy(reduced, 'schemaPath');

    const table = [['message', 'value', 'details']];

    _.forEach(reduced, entry => {
        let dataPath = entry.dataPath;
        const value = JSON.stringify(_.get(data, dataPath, ''));
        if (dataPath === '') {
            dataPath = fileName;
        }

        let message = '';

        switch (dataPath) {
            case '/scripts/prepackage':
                message = `${dataPath} should be renamed to '/scripts/prepare'`;
                break;
            default:
                message = `${dataPath} ${entry.message}`;
        }

        const details = _.chain(entry.params)
            .values()
            .flattenDeep()
            .uniq()
            .join(', ')
            .value();

        return table.push([message, value, details]);
    });

    return textTable(table).split(/\r?\n/);
}

class Doctor {
    constructor(dir, config, wait) {
        this.basedir = dir;
        this.pjsonFile = path.join(this.basedir, 'package.json');
        this.config = config || {};

        this.check(wait);
    }

    heal() {
        if (!this.hasFixableProblems()) {
            return 'No fixable problems found';
        }

        let messages = 'The doctor tries to heal...';

        _.forEach(this.deleteCandidates, file => {
            messages += `\nTrying to delete ${file} ... `;
            try {
                fs.removeSync(file);
                messages += 'Success.';
            } catch (e) {
                messages += 'Failed.';
                messages += `\n${e.toString()}\n`;
            }
        });

        if (!_.isEmpty(this.addDocTemplate)) {
            const docDir = path.dirname(this.addDocTemplate);
            const template = `<!-- <<Component_Head>> ->

<!-- <<Component_Store>> ->
`;

            messages += `\nTrying to add doc template at ${this
                .addDocTemplate} ... `;

            // create directory if not exist
            if (!fs.existsSync(docDir)) {
                fs.mkdirSync(docDir);
            }

            try {
                fs.writeFileSync(this.addDocTemplate, template);
                messages += 'Success.';
            } catch (e) {
                messages += 'Failed.';
                messages += `\n${e.toString()}\n`;
            }
        }

        if (!_.isNull(this.fixedPJSON)) {
            messages += `\nTrying to fix ${this.pjsonFile} ... `;
            try {
                fs.writeJSONSync(this.pjsonFile, this.fixedPJSON, {spaces: 2});
                messages += 'Success.';
            } catch (e) {
                messages += 'Failed.';
                messages += `\n${e.toString()}\n`;
            }
        }

        this.check();

        return messages;
    }

    static asyncSelfCheck({dir, logger = console.log, callback = _.noop}) {
        const checkPackages = {
            '@eccenca/dotfiles': path.join(
                dir,
                'node_modules',
                '@eccenca',
                'dotfiles',
                'package.json'
            ),
            '@eccenca/gulp-tasks': path.join(__dirname, '../../package.json'),
        };

        const msg = [];

        let count = _.size(checkPackages);

        const cb = () => {
            count -= 1;
            if (count <= 0) {
                logger(
                    `Version checks done. ${_.size(
                        msg
                    )} Dependencies out of date.`
                );
                _.forEach(msg, m => logger(m));
                callback();
            }
        };

        _.forEach(checkPackages, (pjson, dep) => {
            logger(`Checking if there is a new version of ${dep}...`);
            try {
                const dfVersion = fs.readJsonSync(pjson).version;
                cp.exec(
                    `yarn info "${dep}" version --json`,
                    (err, stdout, stderr) => {
                        if (err || !_.isEmpty(stderr.toString())) {
                            return;
                        }

                        try {
                            const latest = JSON.parse(stdout.toString()).data;
                            if (!semver.satisfies(dfVersion, latest)) {
                                msg.push(
                                    `${dep}@${dfVersion} installed. Newest version is ${latest}. Please run \`yarn upgrade ${dep}\``
                                );
                            }
                            cb();
                        } catch (e) {
                            cb();
                        }
                    }
                );
            } catch (e) {
                cb();
            }
        });
    }

    check(wait) {
        this.messages = {};
        this.deleteCandidates = [];
        this.fixedPJSON = null;

        // Check for unneeded uitest files
        this.checkNotExists([
            'common-files',
            'ui-test/index.html',
            'ui-test/component.min.js',
            'ui-test/**/*.map',
            'ui-test/**/*.eot',
            'ui-test/**/*.woff*',
            'ui-test/**/*.ttf',
            'ui-test/**/*.svg',
            'version.json',
        ]);

        this.checkDocTemplateExists('docs/docTemplate.md');

        // Check package.json
        this.checkPackageJson();

        this.checkGulpConfig();

        this.checkEnv(wait);
    }

    printEnv({logger = console.log, callback = _.noop}) {
        if (!this.messages.envMessages) {
            logger('Your environment is perfectly set up');
            return callback();
        }

        const envInstructions = _.template(
            fs.readFileSync(
                path.join(__dirname, '../../ENV.md.template'),
                'utf8'
            )
        )(this.versions);

        logger(envInstructions);

        return callback();
    }

    checkEnv(wait) {
        superagent
            .get('https://download.eccenca.com/js/versions.json')
            .use(superagentCache)
            .then(ret => {
                const messages = [];

                const checkCommands = ret.body;
                this.versions = ret.body;

                _.forEach(checkCommands, (version, tool) => {
                    try {
                        const installedVersion = execSync(`${tool} --version`, {
                            cwd: this.basedir,
                        })
                            .toString()
                            .replace(/\r?\n/g, '');

                        if (
                            !semver.satisfies(
                                installedVersion,
                                `${version}`,
                                true
                            )
                        ) {
                            let m = `You are using ${tool}@${installedVersion}.`;
                            m += ` The current recommended version is ${version}.`;

                            messages.push(m);
                        }
                    } catch (e) {
                        // we die gracefully, as the check errored, or something
                    }
                });

                if (!_.isEmpty(messages)) {
                    let envMessages =
                        'The following problems have been found with your environment:';
                    _.map(messages, message => {
                        envMessages += `\n\t${message}`;
                    });

                    envMessages += `\n\n\tPlease run 'gulp doctor --env' for more information/resolutions.`;

                    this.messages.envMessages = envMessages;
                }

                if (wait) {
                    wait();
                }
            });
    }

    checkGulpConfig() {
        const messages = [];

        const deprecatedValues = ['path', 'serverStart', 'serverOverrides'];

        _.forEach(deprecatedValues, key => {
            const value = _.get(this.config, key, false);

            if (value) {
                messages.push(
                    `Please delete deprecated option '${key}': '${value}' from your gulp buildConfig.`
                );
            }
        });

        if (!_.isEmpty(messages)) {
            let gulpConfigMessage =
                'The following problems are in this projects buildConfig:';
            _.map(messages, message => {
                gulpConfigMessage += `\n\t${message}`;
            });

            this.messages.gulpConfig = gulpConfigMessage;
        }
    }

    checkPackageJson() {
        try {
            const originalPJSON = fs.readJSONSync(this.pjsonFile);

            const fixedPJSON = _.clone(originalPJSON);

            let messages = [];

            if (isEccencaPackage(originalPJSON)) {
                const valid = ajv.validate('package.eccenca', originalPJSON);

                if (!valid) {
                    messages = messages.concat(
                        ajvToMessages(ajv.errors, 'package.json', originalPJSON)
                    );
                }

                const newName = nameMap[originalPJSON.name];

                if (newName) {
                    messages.push(`Package should have new name ${newName}`);
                    _.set(fixedPJSON, 'name', newName);
                }

                if (
                    _.has(originalPJSON, ['devDependencies', 'react']) ||
                    _.has(originalPJSON, ['peerDependencies', 'react'])
                ) {
                    messages.push(
                        'Still uses react in a fixed peer dependency (fixable)'
                    );
                    _.set(fixedPJSON, ['peerDependencies', 'react'], '*');
                }

                if (_.has(originalPJSON, ['scripts', 'prepublish'])) {
                    messages.push(
                        'Still uses prepublish instead of prepare (fixable)'
                    );
                    _.set(
                        fixedPJSON,
                        ['scripts', 'prepare'],
                        _.get(originalPJSON, ['scripts', 'prepublish'])
                    );
                    _.set(fixedPJSON, ['scripts', 'prepublish'], undefined);
                }

                if (!_.has(originalPJSON, ['scripts', 'docs'])) {
                    messages.push('Missing docs script (fixable)');
                    _.set(fixedPJSON, ['scripts', 'docs'], 'gulp docs');
                }

                if (!_.has(originalPJSON, ['lint-staged'])) {
                    messages.push('Missing linting (fixable)');
                    _.set(fixedPJSON, ['scripts', 'precommit'], 'lint-staged');
                    _.set(
                        fixedPJSON,
                        ['scripts', 'lint'],
                        "eslint --ignore-path .gitignore --ignore-path .eslintignore '**/*.{js,jsx}' --fix"
                    );
                    _.set(fixedPJSON, ['lint-staged', '*.{js,jsx}'], 'eslint');
                }
            }

            if (!_.isEmpty(messages)) {
                this.fixedPJSON = fixedPJSON;

                let PJSONMessage =
                    'The following problems are in this projects package.json:';
                _.map(messages, message => {
                    PJSONMessage += `\n\t${message}`;
                });

                this.messages.pjson = PJSONMessage;
            }
        } catch (e) {
            // no package.json found / unreadable
            console.warn(e);
        }
    }

    checkNotExists(patterns) {
        this.deleteCandidates = _.union(
            this.deleteCandidates,
            globby.sync(patterns, {
                cwd: this.basedir,
                absolute: true,
            })
        );

        if (!_.isEmpty(this.deleteCandidates)) {
            let deleteCandidates =
                'The following files should be deleted (auto-fixable):';
            _.map(this.deleteCandidates, filePath => {
                deleteCandidates += `\n\t${filePath}`;
            });

            this.messages.deleteCandidates = deleteCandidates;
        }
    }

    checkDocTemplateExists(docTemplatePath) {
        this.addDocTemplate = globby.sync(docTemplatePath, {
            cwd: this.basedir,
            absolute: true,
        });
        // if template file was found remove it from array, else insert path to add
        if (_.isEmpty(this.addDocTemplate)) {
            this.addDocTemplate = docTemplatePath;
            this.messages.addDocTemplate = `The following files should be added (auto-fixable): \n\t${docTemplatePath}`;
        } else {
            this.addDocTemplate = [];
        }
    }

    hasFixableProblems() {
        return (
            !_.isEmpty(this.deleteCandidates) ||
            !_.isEmpty(this.addDocTemplate) ||
            !_.isNull(this.fixedPJSON)
        );
    }

    hasProblems() {
        return this.hasFixableProblems() || !_.isEmpty(this.messages);
    }

    toString() {
        if (!this.hasProblems()) {
            return 'The doctor found no problems';
        }

        let result = 'The doctor found a few symptoms:';

        _.map(this.messages, message => {
            result += `\n\n${message}`;
        });

        if (this.hasFixableProblems()) {
            result +=
                '\n\nSome (or all) of these problems can be fixed automatically.';
            result += '\nPlease run `gulp doctor --heal` to fix them.';
        }

        return result;
    }
}

module.exports = Doctor;
