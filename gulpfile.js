const gulp = require('gulp');

const mocha = require('gulp-spawn-mocha');

const doctor = require('./src/tasks/doctor');
const badmdl = require('./src/tasks/bad-mdl');
const docs = require('./src/tasks/docs');
const docsReact = require('./src/tasks/docs-react');
const docsChannels = require('./src/tasks/docs-channels');
const _ = require('lodash');
const fs = require('fs-extra');

const versions = require('./env.json');

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
        },
        callback
    )
);
gulp.task('docs-channels', callback =>
    docsChannels(
        {
            docPath: 'test/fixtures/docs/**.{js,jsx}',
        },
        callback
    )
);

gulp.task('docs', ['docs-react', 'docs-channels'], callback =>
    docs({}, callback)
);

gulp.task('doctor', ['bad-mdl'], callback => doctor({}, callback));

gulp.task('updateREADME', () => {
    let README = fs.readFileSync('./README.md', 'utf8');

    const envTemplate = _.template(
        fs.readFileSync('./ENV.md.template', 'utf8')
    );

    README = README.replace(
        /<!-- ENV -->[\S\s]+<!-- ENV:END -->\n/gim,
        envTemplate(versions)
    );

    fs.writeFileSync('./README.md', README);
});
