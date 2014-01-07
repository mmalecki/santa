var zlib = require('zlib');
var tar = require('tar');
var fstream = require('fstream');
var fstreamNpm = require('fstream-npm');

module.exports = function build(options, callback) {
  var dir = options.path;
  var tmp = '/tmp/santa.tgz'; // TODO: generate a temp dirname

  fstreamNpm({ path: dir })
    .pipe(tar.Pack())
    .pipe(zlib.Gzip())
    .pipe(fstream.Writer({ type: 'File', path: tmp })) 
    .on('error', callback)
    .on('close', function () {
      callback(null, tmp);
    });
};
