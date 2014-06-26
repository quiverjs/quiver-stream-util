"use strict";
Object.defineProperties(exports, {
  streamToText: {get: function() {
      return streamToText;
    }},
  streamableToText: {get: function() {
      return streamableToText;
    }},
  textToStream: {get: function() {
      return textToStream;
    }},
  textToStreamable: {get: function() {
      return textToStreamable;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var $__0 = $traceurRuntime.assertObject(require('./buffer.js')),
    streamToBuffer = $__0.streamToBuffer,
    streamableToBuffer = $__0.streamableToBuffer,
    bufferToStreamable = $__0.bufferToStreamable;
var streamToText = (function(readStream) {
  return streamToBuffer(readStream).then((function(buffer) {
    return buffer.toString();
  }));
});
var streamableToText = (function(streamable) {
  if (streamable.toText)
    return resolve(streamable.toText());
  return streamableToBuffer(streamable).then((function(buffer) {
    var text = buffer.toString();
    if (streamable.reusable && !streamable.toText) {
      streamable.toText = (function() {
        return resolve(text);
      });
    }
    return text;
  }));
});
var textToStream = (function(text) {
  var $__0 = $traceurRuntime.assertObject(createChanne()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
  writeStream.write(new Buffer(text));
  writeStream.closeWrite();
  return readStream;
});
var textToStreamable = (function(text) {
  var streamable = bufferToStreamable(new Buffer(text));
  streamable.contentType = 'text/plain';
  return streamable;
});
