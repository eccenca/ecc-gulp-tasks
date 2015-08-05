var open = require('opn');

module.exports = {
      deps: ['serve'],
      work: function(config, cb){
          open('http://localhost:8080');
          cb();
      }
  };
