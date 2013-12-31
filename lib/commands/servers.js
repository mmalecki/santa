var santa = require('../../');
var inspect = require('../utils/inspect');

exports.list = function (callback) {
  santa.pkgcloud.getServers(function (err, servers) {
    if (err) {
      return callback(err);
    }

    inspect.servers(servers);
    callback();
  });
};

exports.destroy = function (id, callback) {
  santa.pkgcloud.destroyServer(id, callback);
};
