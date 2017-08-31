const gulp = require('gulp');

const through = require('through2');
const reactDocs = require('react-docgen');
const path = require('path');
const gutil = require('gulp-util');
const concat = require('gulp-concat');

const _ = require('lodash');

const template = _.template(
    `
### <%- name %>

<%= description %>
<% _.forEach(props, function(prop, propName) {

const required = prop.required ? ', *required*' : '';
const type = _.get(prop, 'type.name', '');
const description = _.get(prop, 'description', '').replace(/\\n[\\t ]+/gm,'\\n    ');
let defaultValue = _.get(prop, 'defaultValue.value', '');
if(defaultValue !== ''){
defaultValue = ', default: ' + defaultValue;
}


%>
  - **<%- propName %>** (<%- type %><%- required %><%- defaultValue %>): <%- description %><% });%>

    `
);

const reactDocs2Markdown = json => template(json);

function convert2Docs() {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(
                new gutil.PluginError('gulp-bad-mdl', 'Streaming not supported')
            );
            return;
        }

        const fileContent = file.contents.toString(enc);

        let converted = '';

        try {
            const parsed = reactDocs.parse(fileContent);

            parsed.name = parsed.displayName || path.basename(file.path);

            converted = reactDocs2Markdown(parsed);

            converted += '```json\n';
            converted += JSON.stringify(parsed, null, 2);
            converted += '```';
        } catch (e) {
            gutil.log(`${file.path} contains no React Component`);
        }

        const newFile = file;

        newFile.contents = new Buffer(converted);
        newFile.path = gutil.replaceExtension(file.path, '.md');

        cb(null, newFile);
    });
}

module.exports = function(config) {
    const glob = config.docPath || 'src/**/*.{sass,scss,js,jsx}';
    return gulp
        .src(glob)
        .pipe(convert2Docs())
        .pipe(concat('Components.md'))
        .pipe(gulp.dest('.tmp/'));
};
