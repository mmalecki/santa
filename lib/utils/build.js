var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var tar = require('tar-fs');

module.exports = function build(options, callback) {
  var dir = options.path;
  var tmp = '/tmp/santa.tgz'; // TODO: generate a temp dirname

  tar.pack(dir, {
    ignore: function (name) {
      return [
        'node_modules',
        '.git'
      ].indexOf(path.basename(name)) !== -1;
    }
  })
    .pipe(zlib.Gzip())
    .pipe(fs.createWriteStream(tmp))
    .on('error', callback)
    .on('close', function () {
      callback(null, tmp);
    });
};
