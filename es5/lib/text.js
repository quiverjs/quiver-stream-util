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
var $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__,
    $__buffer_46_js__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var $__2 = ($__buffer_46_js__ = require("./buffer.js"), $__buffer_46_js__ && $__buffer_46_js__.__esModule && $__buffer_46_js__ || {default: $__buffer_46_js__}),
    streamToBuffer = $__2.streamToBuffer,
    streamableToBuffer = $__2.streamableToBuffer,
    bufferToStreamable = $__2.bufferToStreamable;
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
  var $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  writeStream.write(new Buffer(text));
  writeStream.closeWrite();
  return readStream;
});
var textToStreamable = (function(text) {
  var streamable = bufferToStreamable(new Buffer(text));
  streamable.contentType = 'text/plain';
  return streamable;
});
