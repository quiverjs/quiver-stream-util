"use strict";
Object.defineProperties(exports, {
  closeStreamable: {get: function() {
      return closeStreamable;
    }},
  streamToStreamable: {get: function() {
      return streamToStreamable;
    }},
  reuseStream: {get: function() {
      return reuseStream;
    }},
  reuseStreamable: {get: function() {
      return reuseStreamable;
    }},
  unreuseStreamable: {get: function() {
      return unreuseStreamable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__,
    $__buffers__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var buffersToStream = ($__buffers__ = require("./buffers"), $__buffers__ && $__buffers__.__esModule && $__buffers__ || {default: $__buffers__}).buffersToStream;
let closeStreamable = (function(streamable) {
  if (streamable.reusable)
    return resolve();
  return streamable.toStream().then((function(readStream) {
    return readStream.closeRead();
  }));
});
let streamToStreamable = (function(readStream) {
  let opened = false;
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
let reuseStream = (function(readStream) {
  let streamable = {reusable: true};
  let buffers = [];
  let pendingWrites = [];
  streamable.toStream = (function() {
    let $__4 = createChannel(),
        readStream = $__4.readStream,
        writeStream = $__4.writeStream;
    buffers.forEach((function(buffer) {
      return writeStream.write(buffer);
    }));
    pendingWrites.push(writeStream);
    return resolve(readStream);
  });
  let doPipe = (function() {
    readStream.read().then((function($__4) {
      var $__5 = $__4,
          closed = $__5.closed,
          data = $__5.data;
      if (closed) {
        pendingWrites.forEach((function(writeStream) {
          return writeStream.closeWrite();
        }));
        let allBuffers = buffers;
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
let reuseStreamable = (function(streamable) {
  if (streamable.reusable)
    return resolve(streamable);
  return streamable.toStream().then(reuseStream);
});
let unreuseStreamable = (function(streamable) {
  if (!streamable.reusable)
    return streamable;
  let oldToStream = streamable.toStream;
  streamable.reusable = false;
  let opened = false;
  streamable.toStream = (function() {
    if (opened)
      return rreject(error(500, 'streamable can only be opened once'));
    opened = true;
    return oldToStream();
  });
  return streamable;
});
