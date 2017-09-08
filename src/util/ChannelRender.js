const _ = require('lodash');

const template = json => {
    const {name, description, customTags, params, returns} = json;

    // channel information
    const channelInformation = _.chain(customTags)
        .filter(
            tags =>
                tags.tag === 'publicsubject' || tags.tag === 'privatesubject'
        )
        .first()
        .get('value', '')
        .split(' - ')
        .value();

    if (!_.isArray(channelInformation) || channelInformation.length !== 2) {
        throw new Error(
            `Documentation: Channel or Subject could not be found for "${name}". Pls add it like: "channelName - subjectName"`
        );
    }

    const channel = channelInformation[0];
    const subject = channelInformation[1];

    // input parammeter
    const param = _.chain(params)
        .map(inputParam => {
            if (_.isUndefined(inputParam.name)) {
                throw new Error(
                    `Documentation: At least one param name for "${name}" is undefined.`
                );
            }
            if (
                !_.has(inputParam, 'type.names') ||
                !_.isArray(inputParam.type.names) ||
                _.isEmpty(inputParam.type.names[0])
            ) {
                throw new Error(
                    `Documentation: The param type of ${inputParam.name} for "${name}" is undefined.`
                );
            }
            if (_.isUndefined(inputParam.description)) {
                throw new Error(
                    `Documentation: The description of ${inputParam.name} for "${name}" is undefined.`
                );
            }
            return `**${inputParam.name}** ${_.join(
                inputParam.type.names
            )} - ${inputParam.description}`;
        })
        .join('\n')
        .value();

    // return parammeter
    const returning = _.chain(returns)
        .map(returnParam => {
            let typeParam = '';
            if (
                _.has(returnParam, 'type.names') &&
                _.isArray(returnParam.type.names)
            ) {
                typeParam = _.join(returnParam.type.names);
                typeParam = _.isEmpty(typeParam)
                    ? typeParam
                    : `{${typeParam}} `;
            }
            const descriptionParam = returnParam.description
                ? returnParam.description
                : '';
            return typeParam + descriptionParam;
        })
        .join('\n')
        .value();
    const usedParams = _.isEmpty(param)
        ? ''
        : `
Parameter:
${param}
`;
    const usedReturns = _.isEmpty(param)
        ? ''
        : `Return:
${returning}`;

    return `
### ${name}
${description}

Channel: ${channel}
Subject: ${subject}
${usedParams}
${usedReturns}`;
};

function filterChannelType(data, filterType) {
    const customTags = _.get(data, 'customTags', []);
    return _.some(customTags, ({tag}) => tag === filterType);
}

exports.ChannelRender = function(args, {data}) {
    const privateChannels = data.root.filter(fnDocs =>
        filterChannelType(fnDocs, 'privatesubject')
    );
    const publicChannels = data.root.filter(fnDocs =>
        filterChannelType(fnDocs, 'publicsubject')
    );

    const docPrivat = _.chain(privateChannels)
        .map(json => template(json))
        .join('\n')
        .value();
    const docPublic = _.chain(publicChannels)
        .map(json => template(json))
        .join('\n')
        .value();

    let channelsDoc = '';
    if (!_.isEmpty(docPrivat)) {
        channelsDoc += `\n## Privat channels ${docPrivat}`;
    }
    if (!_.isEmpty(docPublic)) {
        channelsDoc += `\n\n## Public channels ${docPublic}`;
    }

    return channelsDoc;
};
