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
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var $__0 = $traceurRuntime.assertObject(require('./buffers.js')),
    streamToBuffers = $__0.streamToBuffers,
    streamableToBuffers = $__0.streamableToBuffers;
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
  var $__0 = $traceurRuntime.assertObject(createChannel()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
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
