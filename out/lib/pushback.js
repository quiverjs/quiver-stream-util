"use strict";
Object.defineProperties(exports, {
  pushbackStream: {get: function() {
      return pushbackStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
let pushbackStream = (function(readStream) {
  var buffers = arguments[1] !== (void 0) ? arguments[1] : [];
  if (readStream.pushback) {
    readStream.pushback(buffers);
    return readStream;
  }
  let newReadStream = Object.create(readStream);
  let doRead = (function() {
    if (buffers.length == 0) {
      return readStream.read();
    } else {
      return resolve({data: buffers.shift()});
    }
  });
  newReadStream.read = doRead;
  newReadStream.closeRead = (function(err) {
    buffers = [];
    return readStream.closeRead(err);
  });
  newReadStream.pushback = (function(moreBuffers) {
    buffers = moreBuffers.concat(buffers);
  });
  newReadStream.peek = (function() {
    if (buffers[0])
      return resolve({data: buffers[0]});
    return doRead((function($__1) {
      var $__2 = $__1,
          closed = $__2.closed,
          data = $__2.data;
      if (closed)
        return {closed: closed};
      buffers.push(data);
      return {data: data};
    }));
  });
  return newReadStream;
});
