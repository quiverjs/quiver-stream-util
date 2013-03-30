
var createChannel = require('quiver-stream-channel').createStreamChannel

var streamToText = function(readStream, callback) {
  var self = { }
  var buffer = ''

  readStream.acquireOwnership(self)

  var doPipe = function() {
    readStream.read(function(streamClosed, data) {
      if(streamClosed) {
        if(streamClosed.err) return callback(streamClosed.err)

        return callback(null, buffer)
      }

      buffer += data
      doPipe()
    })
  }

  doPipe()

  return self
}

var streamableToText = function(streamable, callback) {
  if(streamable.toText) return streamable.toText(callback)

  streamToText(streamable.toStream(), callback)
}

var textToStreamable = function(text) {
  var streamable = { }
  streamable.reusable = true

  streamable.toString = function(callback) {
    callback(null, text)
  }

  streamable.toStream = function() {
    var channel = createChannel()
    var readStream = channel.readStream
    var writeStream = channel.writeStream

    writeStream.write(text.slice())
    writeStream.closeWrite(null)

    return readStream
  }

  return streamable
}

module.exports = {
  streamToText: streamToText,
  streamableToText: streamableToText,
  textToStreamable: textToStreamable
}