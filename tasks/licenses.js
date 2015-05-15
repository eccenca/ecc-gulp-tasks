/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
var checker = require('license-checker');
var _ = require('lodash');

var replaces = {
    'MIT*': 'MIT',
    'MIT/X11': 'MIT',
    'MIT License': 'MIT',
    'Apache*': 'Apache-2.0',
    'Apache v2': 'Apache-2.0',
    'Apache, Version 2.0': 'Apache-2.0',
    'Apache License, Version 2.0': 'Apache-2.0',
    'BSD*': 'BSD',
    'BSD-3-Clause': 'BSD',
    'BSD-2-Clause': 'BSD',
};

var ignoredNames = [
    'ecc-',
    'wkd-',
];

module.exports = function(config, callback) {
    checker.init({
        start: config.rootPath,
    }, function(json) {
        var licenses = {};
        for (var pkg in json) {
            var license = json[pkg].licenses;
            // console.log(json[pkg], pkg);
            if (_.isArray(license)) {
                license = license[0];
            }
            // replace name if needed
            if (replaces[license]) {
                license = replaces[license];
            }

            // prepare info
            var name = pkg.split('@')[0];
            // check if we should ignore name
            var ignore = false;
            for (var i in ignoredNames) {
                var prefix = ignoredNames[i];
                if (name.indexOf(prefix) !== -1) {
                    ignore = true;
                }
            }
            if (ignore) {
                continue;
            }
            // make info
            var info = {
                pkg: name,
                repository: json[pkg].repository,
            };
            if (licenses[license] !== undefined) {
                if (!_.find(licenses[license], {pkg: name})) {
                    licenses[license].push(info);
                }
            } else {
                licenses[license] = [info];
            }
        }
        fs.writeFile(path.join(config.rootPath, 'licenses.json'), JSON.stringify(licenses), function(err) {
            if (err) {
                console.error(err);
            }

            callback();
        });
    });

};
