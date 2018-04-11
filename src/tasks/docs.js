const gulp = require('gulp');
const fs = require('fs');
const replace = require('gulp-replace');
const concat = require('gulp-concat');

function polishText(text) {
    // remove headline
    text = text.replace(/^# Component|^# Channels/, '');
    // increment hashes
    text = text.replace(/#+/g, match => `${match}#`);
    return text;
}

function docs(config) {
    // template path
    const templateFile = config.docTemplatePath || 'docs/docTemplate.md';
    // react components file with adjusted headline
    const compFile = polishText(fs.readFileSync('.tmp/Components.md', 'utf-8'));
    // store file with adjusted headline
    const storeFile = polishText(fs.readFileSync('.tmp/Store.md', 'utf-8'));

    return (
        gulp
            .src(templateFile)
            // insert Component Head
            .pipe(replace('<!-- <<Component_Head>> -->', compFile))
            // insert Component Store
            .pipe(replace('<!-- <<Component_Channels>> -->', storeFile))
            // shrink newLines
            .pipe(replace(/\n{3,}/g, '\n\n'))
            .pipe(concat('README.md'))
            .pipe(gulp.dest(config.docTemplateTarget || 'docs/'))
    );
}

docs.deps = ['docs-react', 'docs-channels'];

module.exports = docs;
