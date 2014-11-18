var async = require('async');
var santa = require('../../');
var inspect = require('../utils/inspect');

exports.list = function (callback) {
  santa.pkgcloud.getImages(function (err, images) {
    if (err) {
      return callback(err);
    }

    inspect.images(images);
    callback();
  });
};

exports.destroy = function () {
  var args = Array.apply(null, arguments);
  var ids = args.slice(0, args.length - 1);
  var callback = args[args.length - 1];

  async.forEachLimit(ids, 4, santa.pkgcloud.destroyImage.bind(santa.pkgcloud), callback);
};
