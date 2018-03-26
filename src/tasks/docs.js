const gulp = require('gulp');
const fs = require('fs');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const _ = require('lodash');

function docs(config) {
    // template path
    const templateFile = config.docTemplatePath || 'docs/docTemplate.md';
    // react components file with adjusted headline
    const compFile = fs
        .readFileSync('.tmp/Components.md', 'utf-8')
        .replace(/#+/g, match => `${match}#`);
    // store file with adjusted headline
    const storeFile = fs
        .readFileSync('.tmp/Store.md', 'utf-8')
        .replace(/#+/g, match => `${match}#`);

    return (
        gulp
            .src(templateFile)
            // replace Component Head
            .pipe(
                replace('<!-- <<Component_Head>> ->', _.trimEnd(compFile, '\n'))
            )
            // replace Component Store
            .pipe(
                replace(
                    '<!-- <<Component_Channels>> ->',
                    _.trimEnd(storeFile, '\n')
                )
            )
            .pipe(concat('README.md'))
            .pipe(gulp.dest(config.docTemplateTarget || 'docs/'))
    );
}

docs.deps = ['docs-react', 'docs-channels'];

module.exports = docs;
