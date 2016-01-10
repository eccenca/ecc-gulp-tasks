var fs = require('fs');

var src = './common-files/dotfiles/.eslintrc.yml';
var dest = './rules/eslintrc.yml';

var content = fs.readFileSync(src);

fs.writeFileSync(dest, content);
