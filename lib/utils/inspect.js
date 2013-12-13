var santa = require('../../');

exports.servers = function (servers) {
  var rows = [['name', 'ip']];
  var colors = ['underline', 'underline'];
  Array.prototype.push.apply(rows, servers.map(function (server) {
    return [ server.name, server.addresses.public[0] ];
  }));
  santa.inspect.putRows('data', rows, colors);
};
