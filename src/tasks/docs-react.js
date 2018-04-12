const gulp = require('gulp');

const through = require('through2');
const reactDocs = require('react-docgen');
const path = require('upath');
const helpers = require('../util/helpers');

const concat = require('gulp-concat');
const _ = require('lodash');

const template = json => {
    const {displayName, description, props} = json;
    const propTypes = [];
    _.forEach(props, (prop, propName) => {
        const propRequired = prop.required ? ', *required*' : '';
        let propType = _.get(prop, 'type.name', '');
        if (_.get(prop, 'type.value', '')) {
            propType = _.join(
                _.map(prop.type.value, (type = {}) => type.name),
                '|'
            );
        }
        const propDescription = _.get(prop, 'description', '').replace(
            /\n[\t ]+/gm,
            '\n    '
        );
        let defaultValue = _.get(prop, 'defaultValue.value', '');
        if (defaultValue !== '') {
            defaultValue = `, default: ${defaultValue}`;
        }
        propTypes.push(
            `- **${propName}** (${propType}${propRequired}${defaultValue}) - ${propDescription}`
        );
    });

    return `{{newStartStringMarker}}# ${displayName}

${description}

## Properties
${_.join(propTypes, '\n')}
`;
};

const reactDocs2Markdown = json => template(json);

function convert2Docs() {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(
                new helpers.PluginError('docs-react', 'Streaming not supported')
            );
            return;
        }

        const fileContent = file.contents.toString(enc);

        let converted = '';

        try {
            const parsed = reactDocs.parse(fileContent);

            helpers.name = parsed.displayName || path.basename(file.path);

            converted = reactDocs2Markdown(parsed);
        } catch (e) {
            helpers.log(`${file.path} contains no React Component`);
        }

        const newFile = file;

        newFile.contents = Buffer.from(converted, 'utf-8');
        const newPath = path.parse(file.path);
        newPath.ext = '.md';
        newFile.path = path.format(newPath);

        cb(null, newFile);
    });
}

// order parts to ensure the doc elements rankings are stable
function orderDocs() {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(
                new helpers.PluginError('docs-react', 'Streaming not supported')
            );
            return;
        }

        const fileContent = file.contents.toString(enc);
        let converted = '';

        try {
            let splitted = fileContent.split('{{newStartStringMarker}}');

            // if first element is empty remove it
            if (_.isEmpty(_.first(splitted))) {
                splitted.shift();
            }

            let splittedEntry = [];
            let splittedNoNEntry = [];
            // devide prioritised once
            _.forEach(splitted, text => {
                if (!_.isNull(text.match(/\n@entryPoint/))) {
                    splittedEntry.push(text.replace(/\n@entryPoint/, ''));
                } else {
                    splittedNoNEntry.push(text);
                }
            });

            // sort parts alphabetically (# a)
            splittedEntry = _.sortBy(splittedEntry, text => {
                const newText = text.match(/^# \S+/);
                return newText[0];
            });
            splittedNoNEntry = _.sortBy(splittedNoNEntry, text => {
                const newText = text.match(/^# \S+/);
                return newText[0];
            });

            // merge parts
            splitted = _.concat(splittedEntry, splittedNoNEntry);

            converted = splitted.join('\n');
        } catch (e) {
            helpers.log(`${file.path} contains no React Component`);
        }

        const newFile = file;
        newFile.contents = Buffer.from(converted, 'utf-8');
        cb(null, newFile);
    });
}

module.exports = function(config) {
    const glob = config.docPath || './src/**/*.{sass,scss,js,jsx}';
    return gulp
        .src(glob)
        .pipe(convert2Docs())
        .pipe(concat('Components.md'))
        .pipe(orderDocs())
        .pipe(gulp.dest(config.docTarget || './.tmp/'));
};
