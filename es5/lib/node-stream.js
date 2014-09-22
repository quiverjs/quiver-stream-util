"use strict";
Object.defineProperties(exports, {
  nodeToQuiverReadStream: {get: function() {
      return nodeToQuiverReadStream;
    }},
  nodeToQuiverWriteStream: {get: function() {
      return nodeToQuiverWriteStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_stream_45_channel__,
    $__quiver_45_promise__;
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__1.resolve,
    createPromise = $__1.createPromise;
var noop = (function() {});
var nodeToQuiverReadStream = (function(nodeRead) {
  var $__2 = createChannel(),
      readStream = $__2.readStream,
      writeStream = $__2.writeStream;
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
    return writeStream.prepareWrite().then((function($__3) {
      var closed = $__3.closed;
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
  var $__2 = createChannel(),
      readStream = $__2.readStream,
      writeStream = $__2.writeStream;
  nodeWrite.on('error', (function(err) {
    return readStream.closeRead(err);
  }));
  var doPipe = (function() {
    return readStream.read().then((function($__3) {
      var $__4 = $__3,
          closed = $__4.closed,
          data = $__4.data;
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
