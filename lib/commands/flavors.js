var santa = require('../../');
var inspect = require('../utils/inspect');

exports.list = function (callback) {
  santa.pkgcloud.getFlavors(function (err, flavors) {
    if (err) {
      return callback(err);
    }

    inspect.flavors(flavors);
    callback();
  });
};
