/* eslint no-var: 0 */
/* eslint no-console: 0 */
/* eslint func-style: 0 */
/* eslint dot-notation: 0 */
/* eslint no-use-before-define: ["error", { "functions": false }] */

var fs = require('fs');
var path = require('path');
var checker = require('license-checker');
var _ = require('lodash');
var util = require('gulp-util');

var licenseData = require('../util/licenseData');

var replacementMap = _.reduce(licenseData, function(result, curr) {

    _.forEach(curr.aliases, function(alias) {
        _.set(result, alias.toLocaleLowerCase(), curr.name);
    });

    _.set(result, curr.name.toLocaleLowerCase(), curr.name);

    return result;
}, {});

var licenseOrder = _.pluck(licenseData, 'name').reverse();

module.exports = function(config, callback) {
    checker.init({
        start: config.rootPath,
        production: true,
    }, function(licenses) {

        licenses = _.chain(licenses)
            .map(function(pkg, key) {
                pkg.pkg = key.split('@')[0];
                pkg.version = key.split('@')[1];
                pkg.license = getPreferredLicense(pkg.licenses);
                pkg.repository = getRepositoryURL(pkg.repository);

                //delete pkg.licenses;
                //delete pkg.licenseFile;
                return pkg;
            })
            .omit(isIgnoredModule)
            .groupBy('license')
            .tap(logMissingAndUnknownLicenses)
            .mapValues(function(group) {
                return _.chain(group)
                    .groupBy('pkg')
                    .map(function(pkg) {
                        //var versions = _.pluck(pkg, 'version');
                        //_.set(pkg,'[0].version', versions)
                        return _.pick(_.first(pkg), ['pkg', 'version', 'repository']);
                    })
                    .value();
            })
            .value();


        fs.writeFile(path.join(config.rootPath, 'licenses.json'), JSON.stringify(licenses), function(err) {
            if (err) {
                callback(new Error(err));
            }

            callback();
        });
    });

};

function getLicenseOrder(license) {
    return _.indexOf(licenseOrder, license);
}

function getPreferredLicense(licenses) {

    return _.chain([licenses])
        .map(function(license) {
            if (_.isString(license)) {
                return license.replace(/^\((.+)\)$/, '$1')
                    .replace(/ (AND|OR) /g, '|x|')
                    .split('|x|');
            }
            return license;
        })
        .flatten()
        .map(function(license) {
            return _.get(replacementMap, license.toLocaleLowerCase(), license);
        })
        .sortBy(getLicenseOrder)
        .last()
        .value();
}

function isIgnoredModule(pkg) {
    return _.contains(pkg.repository, 'gitlab.eccenca.com');
}

function getRepositoryURL(repositoryURL) {
    if (_.isString(repositoryURL)) {
        return repositoryURL.replace(/^git\+/, '');
    }
    return repositoryURL;
}

function logMissingAndUnknownLicenses(licenses) {
    _.forEach(_.get(licenses, 'UNKNOWN'), function(pkg) {
        util.log(
            util.colors.red('[WARNING]:'),
            'license of',
            util.colors.cyan(pkg.pkg + '@' + pkg.version),
            'unknown/missing'
        );
    });

    delete licenses['UNKNOWN'];

    _.forEach(licenses, function(pkgs, licenseName) {
        if (!_.contains(licenseOrder, licenseName)) {

            var sample = _.sample(pkgs);

            util.log(
                util.colors.red('[WARNING]:'),
                'a new unmatched license',
                util.colors.cyan(licenseName),
                'found for example in',
                util.colors.cyan(sample.pkg + '@' + sample.version)
            );
        }
    });

}
