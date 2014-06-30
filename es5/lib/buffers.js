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
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    promisify = $__0.promisify;
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var streamToBuffers = (function(readStream) {
  var buffers = [];
  var doPipe = (function(callback) {
    return readStream.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
      if (closed)
        return callback(null, buffers);
      buffers.push(data);
      doPipe(callback);
    }), callback);
  });
  return promisify(doPipe)();
});
var streamableToBuffers = (function(streamable) {
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
var buffersToStream = (function(buffers) {
  var $__0 = $traceurRuntime.assertObject(createChannel()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
  buffers.forEach((function(buffer) {
    return writeStream.write(buffer);
  }));
  writeStream.closeWrite();
  return readStream;
});
var buffersToStreamable = (function(buffers) {
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
