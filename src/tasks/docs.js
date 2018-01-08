const gulp = require('gulp');
const fs = require('fs');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const _ = require('lodash');

module.exports = function(config) {
    console.warn('debug config', config);
    // template path
    const templateFile = config.docTemplatePath || 'docs/docTemplate.md';
    // react components path
    const compFile = fs.readFileSync('.tmp/Components.md', 'utf-8');
    // store path
    const storeFile = fs.readFileSync('.tmp/Store.md', 'utf-8');

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
                    '<!-- <<Component_Store>> ->',
                    _.trimEnd(storeFile, '\n')
                )
            )
            // add additional '#' to every '#*'-line except first one
            .pipe(replace(/(?!^)#+/g, match => `${match}#`))
            .pipe(concat('README.md'))
            .pipe(gulp.dest(config.docTemplateTarget || 'docs/'))
    );
};
