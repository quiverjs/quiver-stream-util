
var createChannel = require('quiver-stream-channel').createStreamChannel

var streamToBuffers = function(readStream, callback) {
  var self = { }
  var buffers = [ ]

  readStream.acquireOwnership(self)

  var doPipe = function() {
    readStream.read(function(streamClosed, data) {
      if(streamClosed) return callback(streamClosed.err, buffers)

      buffers.push(data)
      doPipe()
    })
  }

  doPipe()

  return self
}

var addStreamableToBuffers = function(streamable, buffers) {
  streamable.toBuffers = function(callback) {
    process.nextTick(function() {
      callback(null, buffers.slice())
    })
  }
}

var streamableToBuffers = function(streamable, callback) {
  if(streamable.toBuffers) return streamable.toBuffers(callback)

  streamToBuffers(streamable.toStream(), function(err, buffers) {
    if(err) return callback(err)

    if(streamable.reusable && !streamable.toBuffers) {
      addStreamableToBuffers(streamable, buffers)
    }

    callback(null, buffers)
  })
}

var buffersToStream = function(buffers, closeErr) {
  var channel = createChannel()
  var readStream = channel.readStream
  var writeStream = channel.writeStream

  buffers.forEach(function(buffer) {
    writeStream.write(buffer)
  })
  writeStream.closeWrite(closeErr)

  return readStream
}

var buffersToStreamable = function(buffers) {
  var streamable = { }

  streamable.reusable = true

  addStreamableToBuffers(streamable, buffers)

  streamable.toStream = function() {
    return buffersToStream(buffers)
  }

  return streamable
}

module.exports = {
  streamToBuffers: streamToBuffers,
  buffersToStream: buffersToStream,
  streamableToBuffers: streamableToBuffers,
  buffersToStreamable: buffersToStreamable
}
