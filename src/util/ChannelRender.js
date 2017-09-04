const _ = require('lodash');

const template = _.template(
`
### **<%- name %>** - <%- description %>
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
    return nameParam + typeParam + descriptionParam
    })
    .join('\\n')
    .value()
%>
Return: <%-
// return parammeter
_.chain(returns)
    .map(function(param) {
    console.log('returns:', param);
    let typeParam = '';
    if (_.has(param, 'type.names') && _.isArray(param.type.names)) {
        typeParam = _.join(param.type.names);
        typeParam = _.isEmpty(typeParam) ? typeParam: '{' + typeParam + '}';
    }
    const descriptionParam = param.description ? ' - ' + param.description : '';
    return typeParam + descriptionParam
    })
    .join('\\n')
    .value()
%>`
);

function filterChannelType(data, filterType) {
    return _.get(data, ['customTags', 0,'tag']) === filterType;
}

exports.ChannelRender = function(args, {data}){
    const privateChannels = data.root.filter(function(fnDocs) {
        return filterChannelType(fnDocs, 'privatchannel');
    });
    const publicChannels = data.root.filter(function(fnDocs) {
        return filterChannelType(fnDocs, 'publicchannel');
    });
    const docPrivat = _.join(_.map(privateChannels, json => template(json)), '\n');
    const docPublic = _.join(_.map(publicChannels, json => template(json)), '\n');

    const channelsDoc = (
        (_.isEmpty(docPrivat) ? '' : '\n#### Privat channels' + docPrivat)
         +
        (_.isEmpty(docPublic) ? '' : '\n\n#### Public channels' + docPublic)
    );

    return channelsDoc;
};
