
var buffersConvert = require('./buffers')

var buffersToNodeBuffers = function(buffers) {
  var nodeBuffers = []

  buffers.forEach(function(buffer) {
    if(buffer instanceof Buffer) {
      nodeBuffers.push(buffer)
    } else {
      nodeBuffers.push(new Buffer(buffer))
    }
  })

  return nodeBuffers
}

var streamToBuffer = function(readStream, callback) {
  buffersConvert.streamToBuffers(readStream, function(err, buffers) {
    if(err) return callback(err)

    var nodeBuffers = buffersToNodeBuffers(buffers)
    var singleBuffer = Buffer.concat(nodeBuffers)
    callback(null, singleBuffer)
  })
}

var addStreamableToBuffer = function(streamable, buffer) {
  streamable.toBuffer = function(callback) {
    process.nextTick(function() {
      callback(null, buffer)
    })
  }
}

var streamableToBuffer = function(streamable, callback) {
  if(streamable.toBuffer) return streamable.toBuffer(callback)

  streamToBuffer(streamable.toStream(), function(err, buffer) {
    if(err) return callback(err)

    if(streamable.reusable && !streamable.toBuffer) {
      addStreamableToBuffer(streamable, buffer)
    }

    callback(null, text)
  })
}


var bufferToStream = function(buffer) {
  var channel = createChannel()
  var readStream = channel.readStream
  var writeStream = channel.writeStream

  writeStream.write(buffer)
  writeStream.closeWrite(null)

  return readStream
}

var bufferToStreamable = function(buffer) {
  var streamable = { }
  streamable.reusable = true

  addStreamableToBuffer(streamable, buffer)

  streamable.toStream = function() {
    return bufferToStream(buffer)
  }

  return streamable
}

module.exports = {
  streamToBuffer: streamToBuffer,
  streamableToBuffer: streamableToBuffer,
  bufferToStream: bufferToStream,
  bufferToStreamable: bufferToStreamable
}