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
var nodeToQuiverReadStream = (function(nodeRead) {
  var $__0 = $traceurRuntime.assertObject(createChannel()),
      readStream = $__0.readStream,
      writeStream = $__0.writeStream;
  var ended = false;
  nodeRead.on('end', (function() {
    if (ended)
      return;
    writeStream.closeWrite();
    ended = true;
  }));
  nodeRead.on('error', (function(err) {
    if (ended)
      return;
    writeStream.closeWrite(err);
    ended = true;
  }));
  var doRead = (function() {
    if (ended)
      return resolve({ended: ended});
    var data = nodeRead.read();
    if (data)
      return resolve({data: data});
    return createPromise((function(resolve) {
      return nodeRead.once('readable', (function() {
        return resolve(doRead());
      }));
    }));
  });
  var doPipe = (function() {
    return writeStream.prepareWrite().then((function($__0) {
      var closed = $__0.closed;
      if (closed || ended)
        return;
      return doRead().then((function($__1) {
        var ended = $__1.ended,
            data = $__1.data;
        if (ended)
          return writeStream.closeWrite();
        writeStream.write(data);
        return doPipe();
      }));
    }));
  });
  doPipe().catch((function(err) {}));
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
      return createPromise((function(resolve) {
        return nodeWrite.once('drain', (function() {
          return resolve(doPipe());
        }));
      }));
    }), (function(err) {
      return nodeWrite.end();
    }));
  });
  doPipe().catch((function(err) {}));
  return writeStream;
});
