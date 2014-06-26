"use strict";
Object.defineProperties(exports, {
  streamToStreamable: {get: function() {
      return streamToStreamable;
    }},
  reuseStream: {get: function() {
      return reuseStream;
    }},
  reuseStreamable: {get: function() {
      return reuseStreamable;
    }},
  __esModule: {value: true}
});
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var buffersToStream = $traceurRuntime.assertObject(require('./buffers.js')).buffersToStream;
var streamToStreamable = (function(readStream) {
  var opened = false;
  return {
    reusable: false,
    toStream: (function() {
      if (opened)
        return reject(error(500, 'streamable can only be opened once'));
      opened = true;
      return resolve(readStream);
    })
  };
});
var reuseStream = (function(readStream) {
  var streamable = {reusable: true};
  var buffers = [];
  var pendingWrites = [];
  streamable.toStream = (function() {
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        readStream = $__0.readStream,
        writeStream = $__0.writeStream;
    buffers.forEach((function(buffer) {
      return writeStream.write(buffer);
    }));
    pendingWrites.push(writeStream);
    return resolve(readStream);
  });
  var doPipe = (function() {
    readStream.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
      if (closed) {
        pendingWrites.forEach((function(writeStream) {
          return writeStream.closeWrite();
        }));
        var allBuffers = buffers;
        streamable.toStream = (function() {
          return resolve(buffersToStream(allBuffers));
        });
      } else {
        buffers.push(data);
        pendingWrites.forEach((function(writeStream) {
          return writeStream.write(data);
        }));
        doPipe();
      }
    }), (function(err) {
      pendingWrites.forEach((function(writeStream) {
        return writeStream.closeWrite(err);
      }));
      streamable.toStream = (function() {
        return reject(err);
      });
    }));
  });
  doPipe();
  return streamable;
});
var reuseStreamable = (function(streamable) {
  if (streamable.reusable)
    return resolve(streamable);
  return streamable.toStream().then(reuseStream);
});
