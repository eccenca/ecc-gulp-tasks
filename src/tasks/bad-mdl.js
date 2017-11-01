const gulp = require('gulp');

const through = require('through2');
const gutil = require('gulp-util');

const _ = require('lodash');

const badItems = [
    'mdl-button',
    'mdl-alert',
    'mdl-card',
    'mdl-checkbox',
    'mdl-chip',
    'mdl-menu',
    'mdl-dialog',
    'material-icons',
    'mdl-progress',
    'mdl-radio',
    'mdl-textfield',
    'mdl-spinner',
    'mdl-switch',
    'mdl-tabs',
];

function containsBadMDL(callback) {
    let result = {};

    const regexes = {};

    return through
        .obj((file, enc, cb) => {
            if (file.isNull()) {
                cb(null, file);
                return;
            }

            if (file.isStream()) {
                cb(
                    new gutil.PluginError(
                        'gulp-bad-mdl',
                        'Streaming not supported'
                    )
                );
                return;
            }

            const fileContent = file.contents.toString(enc);

            _.forEach(badItems, item => {
                const search = _.get(regexes, item, new RegExp(item, 'g'));

                result[item] =
                    _.get(result, item, 0) +
                    (fileContent.match(search) || []).length;

                regexes[item] = search;
            });

            cb(null, file);
        })
        .on('finish', () => {
            let resultString = _.chain(result)
                .map((count, key) => {
                    if (count > 0) {
                        return `Found ${key} ${count} times`;
                    }
                    return null;
                })
                .reject(_.isNull)
                .join('\n')
                .value();

            result = _.omitBy(
                result,
                count => !_.isNumber(count) || count === 0
            );

            if (resultString !== '') {
                resultString = `${gutil.colors.yellow(
                    '[WARN]'
                )} bad mdl patterns found:\n${resultString}`;
            } else {
                resultString = '[INFO] no bad mdl patterns found.';
            }

            gutil.log(resultString);

            callback(null, result);
        });
}

module.exports = function(config, callback) {
    const glob =
        config.checkForBadMDL || '{src,ui-test,test}/**/*.{sass,scss,js,jsx}';

    gulp
        .src(glob)
        .pipe(containsBadMDL(callback))
        .on('data', _.noop);
};
