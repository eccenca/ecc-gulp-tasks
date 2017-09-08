const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

// define which parts of whole jsdoc2md docu should be rendered
const docStyle = `# Channels
{{#ChannelRender functions}}{{this}}{{/ChannelRender}}`;

module.exports = function(config, callback) {
    const glob = config.docPath || 'src/**/*.{js,jsx}';
    const helper = 'src/util/ChannelRender.js';
    const output = jsdoc2md.renderSync({
        files: glob,
        template: docStyle,
        helper,
    });
    fs.writeFile('.tmp/Store.md', output);
    callback(null, null);
};
