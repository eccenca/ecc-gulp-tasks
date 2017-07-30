const gulp = require('gulp');

const mocha = require('gulp-spawn-mocha');

const doctor = require('./src/tasks/doctor');

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

gulp.task('doctor', callback => doctor({}, callback));

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
