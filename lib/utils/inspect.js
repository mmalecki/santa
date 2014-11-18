var santa = require('../../');

exports.servers = function (servers) {
  var rows = [['id', 'name', 'ip']];
  var colors = ['underline', 'underline', 'underline'];
  Array.prototype.push.apply(rows, servers.map(function (server) {
    return [ server.id, server.name, server.addresses.public[0] ];
  }));
  santa.inspect.putRows('data', rows, colors);
};

exports.server = function (server) {
  var obj = {
    id: server.id,
    name: server.name,
    status: server.status
  };

  if (server.addresses) {
    obj.addresses = server.addresses.public;
  }

  santa.inspect.putObject(obj);
};

exports.image = function (image) {
  santa.inspect.putObject({
    id: image.id,
    name: image.name
  });
};

exports.images = function (images) {
  var rows = [['id', 'name']];
  var colors = ['underline', 'underline'];
  Array.prototype.push.apply(rows, images.map(function (image) {
    return [ image.id, image.name ];
  }));
  santa.inspect.putRows('data', rows, colors);
};

exports.flavors = function (flavors) {
  var rows = [['id', 'name']];
  var colors = ['underline', 'underline'];
  Array.prototype.push.apply(rows, flavors.map(function (flavor) {
    return [ flavor.id, flavor.name ];
  }));
  santa.inspect.putRows('data', rows, colors);
};
