var async = require('async');
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

exports.destroy = function () {
  var args = Array.apply(null, arguments);
  var ids = args.slice(0, args.length - 1);
  var callback = args[args.length - 1];

  async.forEachLimit(ids, 4, santa.pkgcloud.destroyServer.bind(santa.pkgcloud), callback);
};
