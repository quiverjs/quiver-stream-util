
var createChannel = require('quiver-stream-channel').createStreamChannel

var streamToBuffers = function(readStream, callback) {
  var self = { }
  var buffers = [ ]

  readStream.acquireOwnership(self)

  var doPipe = function() {
    readStream.read(function(streamClosed, data) {
      if(streamClosed) {
        if(streamClosed.err) return callback(streamClosed.err)

        return callback(null, buffers)
      }

      buffers.push(data)
      doPipe()
    })
  }

  doPipe()

  return self
}

var streamableToBuffers = function(streamable, callback) {
  if(streamable.toBuffers) return streamable.toBuffers(callback)

  streamToBuffers(streamable.toStream(), callback)
}

var buffersToStreamable = function(buffers) {
  var streamable = { }

  streamable.reusable = true

  streamable.toBuffers = function(callback) {
    callback(null, buffers.slice())
  }

  streamable.toStream = function() {
    var channel = createChannel()
    var readStream = channel.readStream
    var writeStream = channel.writeStream

    buffers.forEach(function(buffer) {
      writeStream.write(buffer)
    })
    writeStream.closeWrite(null)

    return readStream
  }

  return streamable
}

module.exports = {
  streamToBuffers: streamToBuffers,
  streamableToBuffers: streamableToBuffers,
  buffersToStreamable: buffersToStreamable
}
