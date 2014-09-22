"use strict";
Object.defineProperties(exports, {
  pipeStream: {get: function() {
      return pipeStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__0.resolve,
    reject = $__0.reject;
var pipeStream = (function(readStream, writeStream) {
  var doPipe = (function() {
    return writeStream.prepareWrite().then((function($__1) {
      var closed = $__1.closed;
      if (closed) {
        readStream.closeRead();
        return resolve();
      }
      return readStream.read().then((function($__3) {
        var $__4 = $__3,
            closed = $__4.closed,
            data = $__4.data;
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
