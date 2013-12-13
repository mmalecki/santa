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
