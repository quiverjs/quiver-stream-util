"use strict";
Object.defineProperties(exports, {
  streamToBuffer: {get: function() {
      return streamToBuffer;
    }},
  streamableToBuffer: {get: function() {
      return streamableToBuffer;
    }},
  bufferToStream: {get: function() {
      return bufferToStream;
    }},
  bufferToStreamable: {get: function() {
      return bufferToStreamable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__,
    $__buffers_46_js__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var $__2 = ($__buffers_46_js__ = require("./buffers.js"), $__buffers_46_js__ && $__buffers_46_js__.__esModule && $__buffers_46_js__ || {default: $__buffers_46_js__}),
    streamToBuffers = $__2.streamToBuffers,
    streamableToBuffers = $__2.streamableToBuffers;
var nodeBuffers = (function(buffers) {
  return buffers.map((function(buffer) {
    return (buffer instanceof Buffer) ? buffer : new Buffer(buffer);
  }));
});
var buffersToBuffer = (function(buffers) {
  return Buffer.concat(nodeBuffers(buffers));
});
var streamToBuffer = (function(readStream) {
  return streamToBuffers(readStream).then(buffersToBuffer);
});
var streamableToBuffer = (function(streamable) {
  if (streamable.toBuffer)
    return resolve(streamable.toBuffer());
  return streamableToBuffers(streamable).then(buffersToBuffer).then((function(buffer) {
    if (streamable.reusable && !streamable.toBuffer) {
      streamable.toBuffer = (function() {
        return resolve(buffer);
      });
    }
    return buffer;
  }));
});
var bufferToStream = (function(buffer) {
  var $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  writeStream.write(buffer);
  writeStream.closeWrite(null);
  return readStream;
});
var bufferToStreamable = (function(buffer) {
  return ({
    reusable: true,
    contentLength: buffer.length,
    toBuffer: (function() {
      return resolve(buffer);
    }),
    toBuffers: (function() {
      return resolve([buffer]);
    }),
    toStream: (function() {
      return resolve(bufferToStream(buffer));
    })
  });
});
