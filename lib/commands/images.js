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
