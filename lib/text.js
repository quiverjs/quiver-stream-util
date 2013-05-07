
var bufferConvert = require('./buffer')
var createChannel = require('quiver-stream-channel').createStreamChannel

var streamToText = function(readStream, callback) {
  bufferConvert.streamToBuffer(readStream, function(err, buffer) {
    if(err) return callback(err)

    callback(null, buffer.toString())
  })
}

var addStreamableToText = function(streamable, text) {
  streamable.toText = function(callback) {
    process.nextTick(function() {
      callback(null, text.slice())
    })
  }
}

var streamableToText = function(streamable, callback) {
  if(streamable.toText) return streamable.toText(callback)

  streamToText(streamable.toStream(), function(err, text) {
    if(err) return callback(err)

    if(streamable.reusable && !streamable.toText) {
      addStreamableToText(streamable, text)
    }

    callback(null, text)
  })
}

var textToStream = function(text) {
  var channel = createChannel()
  var readStream = channel.readStream
  var writeStream = channel.writeStream

  writeStream.write(text)
  writeStream.closeWrite(null)

  return readStream
}

var textToStreamable = function(text) {
  var streamable = { }
  streamable.reusable = true

  addStreamableToText(streamable, text)

  streamable.toStream = function() {
    return textToStream(text.slice())
  }

  return streamable
}

module.exports = {
  streamToText: streamToText,
  textToStream: textToStream,
  streamableToText: streamableToText,
  textToStreamable: textToStreamable
}