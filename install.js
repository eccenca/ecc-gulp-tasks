var fs = require('fs');

var src = './node_modules/ecc-dotfiles/linkFiles/.eslintrc.yml';
var dest = './src/rules/eslintrc.yml';

var content = fs.readFileSync(src);

fs.writeFileSync(dest, content);
