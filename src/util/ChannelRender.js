const _ = require('lodash');

const template = _.template(`
#### <%- name %>
<%- description %>

<%-
// input parammeter
_.chain(params)
    .map(function(param) {
    let typeParam = '';
    if (_.has(param, 'type.names') && _.isArray(param.type.names)) {
        typeParam = _.join(param.type.names);
        typeParam = _.isEmpty(typeParam) ? typeParam: ' {' + typeParam + '}';
    }
    const nameParam = param.name;
    const descriptionParam = param.description ? ' - ' + param.description : '';
    return '**' + nameParam + '**' + typeParam + descriptionParam
    })
    .join('\\n')
    .value()
%>
Return: <%-
// return parammeter
_.chain(returns)
    .map(function(param) {
    let typeParam = '';
    if (_.has(param, 'type.names') && _.isArray(param.type.names)) {
        typeParam = _.join(param.type.names);
        typeParam = _.isEmpty(typeParam) ? typeParam: '{' + typeParam + '} ';
    }
    const descriptionParam = param.description ? param.description : '';
    return typeParam + descriptionParam
    })
    .join('\\n')
    .value()
%>`);

function filterChannelType(data, filterType) {
    return _.get(data, ['customTags', 0, 'tag']) === filterType;
}

exports.ChannelRender = function(args, {data}) {
    const privateChannels = data.root.filter(fnDocs =>
        filterChannelType(fnDocs, 'privatchannel')
    );
    const publicChannels = data.root.filter(fnDocs =>
        filterChannelType(fnDocs, 'publicchannel')
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
        channelsDoc += `\n### Privat channels ${docPrivat}`;
    }
    if (!_.isEmpty(docPublic)) {
        channelsDoc += `\n\n### Public channels ${docPublic}`;
    }

    return channelsDoc;
};
