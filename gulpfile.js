var gulp = require('gulp');

var mocha = require('gulp-spawn-mocha');

var lint = require('./src/tasks/lint');
var doctor = require('./src/tasks/doctor');

var _ = require('lodash');
var fs = require('fs-extra');

gulp.task('test', function() {
    return gulp.src(['test/*.test.js'], {read: false})
        .pipe(mocha({
            env: {'NODE_ENV': 'test'}
        }));
});

gulp.task('lint', function() {
    return lint({lintingFiles: './src/tasks/*.js'});
});

gulp.task('doctor', function(callback) {
    return doctor({}, callback);
});

gulp.task('updateREADME', function() {

    var README = fs.readFileSync('./README.md', 'utf8');
    var envTemplate = _.template(fs.readFileSync('./ENV.md.template', 'utf8'));
    var versions = require('./env.json');
    README = README.replace(/<!-- ENV -->[\S\s]+<!-- ENV:END -->\n/igm, envTemplate(versions));

    fs.writeFileSync('./README.md', README);

});
