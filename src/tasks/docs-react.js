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

    return `# ${displayName}

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

            /*
            converted += '```json\n';
            converted += JSON.stringify(parsed, null, 2);
            converted += '```';
            */
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

module.exports = function(config) {
    const glob = config.docPath || './src/**/*.{sass,scss,js,jsx}';
    return gulp
        .src(glob)
        .pipe(convert2Docs())
        .pipe(concat('Components.md'))
        .pipe(gulp.dest(config.docTarget || './.tmp/'));
};
