var santa = require('../../');

exports.servers = function (servers) {
  var rows = [['id', 'name', 'ip']];
  var colors = ['underline', 'underline', 'underline'];
  Array.prototype.push.apply(rows, servers.map(function (server) {
    return [ server.id, server.name, server.addresses.public[0] ];
  }));
  santa.inspect.putRows('data', rows, colors);
};

exports.images = function (images) {
  var rows = [['id', 'name']];
  var colors = ['underline', 'underline'];
  Array.prototype.push.apply(rows, images.map(function (image) {
    return [ image.id, image.name ];
  }));
  santa.inspect.putRows('data', rows, colors);
};
