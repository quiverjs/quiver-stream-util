"use strict";
Object.defineProperties(exports, {
  pushbackStream: {get: function() {
      return pushbackStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var pushbackStream = (function(readStream, buffers) {
  if (readStream.pushback) {
    readStream.pushback(buffers);
    return readStream;
  }
  var newReadStream = Object.create(readStream);
  newReadStream.read = (function() {
    if (buffers.length == 0) {
      return readStream.read();
    } else {
      return resolve({data: buffers.shift()});
    }
  });
  newReadStream.closeRead = (function(err) {
    buffers = [];
    return readStream.CloseRead(err);
  });
  newReadStream.pushback = (function(moreBuffers) {
    buffers = moreBuffers.concat(buffers);
  });
  return newReadStream;
});
