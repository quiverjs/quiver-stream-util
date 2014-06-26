"use strict";
Object.defineProperties(exports, {
  pipeStream: {get: function() {
      return pipeStream;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    reject = $__0.reject;
var pipeStream = (function(readStream, writeStream) {
  var doPipe = (function() {
    return writeStream.prepareWrite().then((function($__0) {
      var closed = $__0.closed;
      if (closed) {
        readStream.closeRead();
        return resolve();
      }
      return readStream.read().then((function($__1) {
        var closed = $__1.closed,
            data = $__1.data;
        if (closed) {
          writeStream.closeWrite();
          return resolve();
        }
        writeStream.write(data);
        return doPipe();
      }), (function(err) {
        writeStream.closeWrite(err);
        return reject(err);
      }));
    }), (function(err) {
      readStream.closeRead(err);
      return reject(err);
    }));
  });
  return doPipe();
});
