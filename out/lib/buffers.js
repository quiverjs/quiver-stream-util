"use strict";
Object.defineProperties(exports, {
  streamToBuffers: {get: function() {
      return streamToBuffers;
    }},
  streamableToBuffers: {get: function() {
      return streamableToBuffers;
    }},
  buffersToStream: {get: function() {
      return buffersToStream;
    }},
  buffersToStreamable: {get: function() {
      return buffersToStreamable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__;
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__0.resolve,
    promisify = $__0.promisify;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
let streamToBuffers = (function(readStream) {
  let buffers = [];
  let doPipe = (function(callback) {
    return readStream.read().then((function($__2) {
      var $__3 = $__2,
          closed = $__3.closed,
          data = $__3.data;
      if (closed)
        return callback(null, buffers);
      buffers.push(data);
      doPipe(callback);
    }), callback);
  });
  return promisify(doPipe)();
});
let streamableToBuffers = (function(streamable) {
  if (streamable.toBuffers)
    return resolve(streamable.toBuffers());
  return streamable.toStream().then((function(readStream) {
    return streamToBuffers(readStream).then((function(buffers) {
      if (streamable.reusable && !streamable.toBuffers) {
        streamable.toBuffers = (function() {
          return resolve(buffers.slice());
        });
        return buffers.slice();
      }
      return buffers;
    }));
  }));
});
let buffersToStream = (function(buffers) {
  let $__2 = createChannel(),
      readStream = $__2.readStream,
      writeStream = $__2.writeStream;
  buffers.forEach((function(buffer) {
    return writeStream.write(buffer);
  }));
  writeStream.closeWrite();
  return readStream;
});
let buffersToStreamable = (function(buffers) {
  return ({
    reusable: true,
    toBuffers: (function() {
      return resolve(buffers.slice());
    }),
    toStream: (function() {
      return resolve(buffersToStream(buffers));
    })
  });
});
