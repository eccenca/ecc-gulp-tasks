const gulp = require('gulp');

const mocha = require('gulp-spawn-mocha');

const doctor = require('./src/tasks/doctor');
const badmdl = require('./src/tasks/bad-mdl');
const docs = require('./src/tasks/docs');
const docsReact = require('./src/tasks/docs-react');
const docsChannels = require('./src/tasks/docs-channels');

gulp.task('test', () =>
    gulp.src(['test/*.test.js'], {read: false}).pipe(
        mocha({
            env: {NODE_ENV: 'test'},
        })
    )
);

gulp.task('bad-mdl', callback => badmdl({}, callback));

gulp.task('docs-react', callback =>
    docsReact(
        {
            docPath: 'test/fixtures/docs/**.{js,jsx}',
            docTarget: '.tmp/',
        },
        callback
    )
);
gulp.task('docs-channels', callback =>
    docsChannels(
        {
            docPath: 'test/fixtures/docs/**.{js,jsx}',
            docTarget: '.tmp/Store.md',
        },
        callback
    )
);

gulp.task('docs', ['docs-react', 'docs-channels'], callback =>
    docs(
        {
            docTemplatePath: '.tmp/docTemplate.md',
            docTemplateTarget: '.tmp/',
        },
        callback
    )
);

gulp.task('doctor', ['bad-mdl'], callback => doctor({}, callback));
