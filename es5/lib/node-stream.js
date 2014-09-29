"use strict";
Object.defineProperties(exports, {
  nodeReadToStreamable: {get: function() {
      return nodeReadToStreamable;
    }},
  nodeToQuiverReadStream: {get: function() {
      return nodeToQuiverReadStream;
    }},
  nodeToQuiverWriteStream: {get: function() {
      return nodeToQuiverWriteStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_channel__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__1.resolve,
    reject = $__1.reject;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var noop = (function() {});
var nodeReadToStreamable = (function(nodeRead) {
  var opened = false;
  var toStream = (function() {
    if (opened)
      return reject(error(500, 'streamable can only be opened once'));
    opened = true;
    return resolve(nodeToQuiverReadStream(nodeRead));
  });
  var toNodeStream = (function() {
    if (opened)
      return reject(error(500, 'streamable can only be opened once'));
    opened = true;
    return resolve(nodeRead);
  });
  return {
    reusable: false,
    toStream: toStream,
    toNodeStream: toNodeStream
  };
});
var nodeToQuiverReadStream = (function(nodeRead) {
  var $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  var ended = false;
  nodeRead.on('end', (function() {
    if (ended)
      return;
    ended = true;
    writeStream.closeWrite();
  }));
  nodeRead.on('error', (function(err) {
    if (ended)
      return;
    ended = true;
    writeStream.closeWrite(err);
  }));
  var doRead = (function(callback) {
    if (ended)
      return;
    var data = nodeRead.read();
    if (data)
      return callback(data);
    nodeRead.once('readable', (function() {
      return doRead(callback);
    }));
  });
  var doPipe = (function() {
    return writeStream.prepareWrite().then((function($__4) {
      var closed = $__4.closed;
      if (closed)
        return nodeRead.resume();
      doRead((function(data) {
        writeStream.write(data);
        doPipe();
      }));
    }));
  });
  doPipe();
  return readStream;
});
var nodeToQuiverWriteStream = (function(nodeWrite) {
  var $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  nodeWrite.on('error', (function(err) {
    return readStream.closeRead(err);
  }));
  var doPipe = (function() {
    return readStream.read().then((function($__4) {
      var $__5 = $__4,
          closed = $__5.closed,
          data = $__5.data;
      if (closed)
        return nodeWrite.end();
      var ready = nodeWrite.write(data);
      if (ready)
        return doPipe();
      nodeWrite.once('drain', doPipe);
    }), (function(err) {
      return nodeWrite.end();
    }));
  });
  doPipe();
  return writeStream;
});
