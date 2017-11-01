/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const createInnerCallback = require('enhanced-resolve/lib/createInnerCallback');
const _ = require('lodash');

const aliases = require('../../nameMap');

const mappedPackages = _.keys(aliases);

function EccencaResolverPlugin() {}

EccencaResolverPlugin.prototype.apply = function(resolver) {
    function eccencaResolver(request, callback) {
        const innerRequest = request.request;

        if (!innerRequest) {
            return callback();
        }

        if (!_.startsWith(innerRequest, 'ecc-')) {
            return callback();
        }

        const name = innerRequest.split('/', 1)[0];

        if (_.includes(mappedPackages, name)) {
            const alias = aliases[name];

            const newRequestStr = alias + innerRequest.substr(name.length);
            const obj = Object.assign({}, request, {
                request: newRequestStr,
            });

            const file = _.get(request, 'context.issuer');

            if (file) {
                console.warn(
                    `WARNING: Still using '${name}' in ${file}, please use '${newRequestStr}'`
                );
            }

            return resolver.doResolve(
                'resolve',
                obj,
                `EccencaResolverPlugin: Mapped  '${name}' to '${alias}': '${innerRequest}' to '${newRequestStr}'`,
                createInnerCallback(function(err, result) {
                    if (arguments.length > 0) return callback(err, result);

                    // don't allow other aliasing or raw request
                    return callback(null, null);
                }, callback)
            );
        }
        return callback();
    }

    resolver.plugin('described-resolve', eccencaResolver);
    resolver.plugin('file', eccencaResolver);
};

module.exports = EccencaResolverPlugin;
