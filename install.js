var fs = require('fs');

var src = './node_modules/ecc-dotfiles/dotfiles/.eslintrc.yml';
var dest = './rules/eslintrc.yml';

var content = fs.readFileSync(src);

fs.writeFileSync(dest, content);
