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
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    createPromise = $__0.createPromise;
var noop = (function() {});
var nodeToQuiverReadStream = (function(nodeRead) {
  var $__0 = $traceurRuntime.assertObject(createChannel()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
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
    return writeStream.prepareWrite().then((function($__0) {
      var closed = $__0.closed;
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
  var $__0 = $traceurRuntime.assertObject(createChannel()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
  nodeWrite.on('error', (function(err) {
    return readStream.closeRead(err);
  }));
  var doPipe = (function() {
    return readStream.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
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
