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
  toTextToStreamable: {get: function() {
      return toTextToStreamable;
    }},
  textToStreamable: {get: function() {
      return textToStreamable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__,
    $__buffer__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var $__2 = ($__buffer__ = require("./buffer"), $__buffer__ && $__buffer__.__esModule && $__buffer__ || {default: $__buffer__}),
    streamToBuffer = $__2.streamToBuffer,
    streamableToBuffer = $__2.streamableToBuffer,
    toBufferToStreamable = $__2.toBufferToStreamable;
let streamToText = (function(readStream) {
  return streamToBuffer(readStream).then((function(buffer) {
    return buffer.toString();
  }));
});
let streamableToText = (function(streamable) {
  if (streamable.toText)
    return resolve(streamable.toText());
  return streamableToBuffer(streamable).then((function(buffer) {
    let text = buffer.toString();
    if (streamable.reusable && !streamable.toText) {
      streamable.toText = (function() {
        return resolve(text);
      });
    }
    return text;
  }));
});
let textToStream = (function(text) {
  let $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  writeStream.write(new Buffer(text));
  writeStream.closeWrite();
  return readStream;
});
let toTextToStreamable = (function(toText) {
  var contentType = arguments[1] !== (void 0) ? arguments[1] : 'text/plain';
  let buffer = null;
  let toBuffer = (function() {
    if (!buffer)
      buffer = new Buffer(toText());
    return buffer;
  });
  let streamable = toBufferToStreamable(toBuffer);
  streamable.toText = (function() {
    return resolve(toText());
  });
  streamable.contentType = contentType;
  return streamable;
});
let textToStreamable = (function(text) {
  var contentType = arguments[1] !== (void 0) ? arguments[1] : 'text/plain';
  return toTextToStreamable((function() {
    return text;
  }), contentType);
});
