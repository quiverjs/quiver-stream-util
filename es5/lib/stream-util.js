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
  streamToJson: {get: function() {
      return streamToJson;
    }},
  streamableToJson: {get: function() {
      return streamableToJson;
    }},
  jsonToStream: {get: function() {
      return jsonToStream;
    }},
  jsonToStreamable: {get: function() {
      return jsonToStreamable;
    }},
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
  nodeToQuiverReadStream: {get: function() {
      return nodeToQuiverReadStream;
    }},
  nodeToQuiverWriteStream: {get: function() {
      return nodeToQuiverWriteStream;
    }},
  nodeReadToStreamable: {get: function() {
      return nodeReadToStreamable;
    }},
  emptyReadStream: {get: function() {
      return emptyReadStream;
    }},
  emptyWriteStream: {get: function() {
      return emptyWriteStream;
    }},
  emptyStreamable: {get: function() {
      return emptyStreamable;
    }},
  pipeStream: {get: function() {
      return pipeStream;
    }},
  createChannel: {get: function() {
      return createChannel;
    }},
  pushbackStream: {get: function() {
      return pushbackStream;
    }},
  __esModule: {value: true}
});
var $__buffers__,
    $__buffer__,
    $__text__,
    $__json__,
    $__streamable__,
    $__pushback__,
    $__node_45_stream__,
    $__empty__,
    $__pipe__,
    $__quiver_45_stream_45_channel__;
var $__0 = ($__buffers__ = require("./buffers"), $__buffers__ && $__buffers__.__esModule && $__buffers__ || {default: $__buffers__}),
    streamToBuffers = $__0.streamToBuffers,
    streamableToBuffers = $__0.streamableToBuffers,
    buffersToStream = $__0.buffersToStream,
    buffersToStreamable = $__0.buffersToStreamable;
var $__1 = ($__buffer__ = require("./buffer"), $__buffer__ && $__buffer__.__esModule && $__buffer__ || {default: $__buffer__}),
    streamToBuffer = $__1.streamToBuffer,
    streamableToBuffer = $__1.streamableToBuffer,
    bufferToStream = $__1.bufferToStream,
    bufferToStreamable = $__1.bufferToStreamable;
var $__2 = ($__text__ = require("./text"), $__text__ && $__text__.__esModule && $__text__ || {default: $__text__}),
    streamToText = $__2.streamToText,
    streamableToText = $__2.streamableToText,
    textToStream = $__2.textToStream,
    textToStreamable = $__2.textToStreamable;
var $__3 = ($__json__ = require("./json"), $__json__ && $__json__.__esModule && $__json__ || {default: $__json__}),
    streamToJson = $__3.streamToJson,
    streamableToJson = $__3.streamableToJson,
    jsonToStream = $__3.jsonToStream,
    jsonToStreamable = $__3.jsonToStreamable;
var $__4 = ($__streamable__ = require("./streamable"), $__streamable__ && $__streamable__.__esModule && $__streamable__ || {default: $__streamable__}),
    closeStreamable = $__4.closeStreamable,
    streamToStreamable = $__4.streamToStreamable,
    reuseStream = $__4.reuseStream,
    reuseStreamable = $__4.reuseStreamable,
    unreuseStreamable = $__4.unreuseStreamable;
var pushbackStream = ($__pushback__ = require("./pushback"), $__pushback__ && $__pushback__.__esModule && $__pushback__ || {default: $__pushback__}).pushbackStream;
var $__6 = ($__node_45_stream__ = require("./node-stream"), $__node_45_stream__ && $__node_45_stream__.__esModule && $__node_45_stream__ || {default: $__node_45_stream__}),
    nodeToQuiverReadStream = $__6.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__6.nodeToQuiverWriteStream,
    nodeReadToStreamable = $__6.nodeReadToStreamable;
var $__7 = ($__empty__ = require("./empty"), $__empty__ && $__empty__.__esModule && $__empty__ || {default: $__empty__}),
    emptyReadStream = $__7.emptyReadStream,
    emptyWriteStream = $__7.emptyWriteStream,
    emptyStreamable = $__7.emptyStreamable;
var pipeStream = ($__pipe__ = require("./pipe"), $__pipe__ && $__pipe__.__esModule && $__pipe__ || {default: $__pipe__}).pipeStream;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
;
