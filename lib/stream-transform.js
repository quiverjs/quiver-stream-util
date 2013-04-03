
var createChannel = require('quiver-stream-channel').createStreamChannel
var streamableConvert = require('./streamable')

var createStreamTransformer = function(transformName, transformFunction) {
  var streamToTransformedStream = function(readStream, callback) {
    var self = { }

    var channel = createChannel()
    var writeStream = channel.writeStream
    var transformedStream = channel.readStream

    readStream.acquireOwnership(self)
    writeStream.acquireOwnership(self)

    var doPipe = function() {
      writeStream.prepareWrite(function(streamClosed) {
        if(streamClosed) return readStream.closeRead(streamClosed.err)

        readStream.read(function(streamClosed, data) {
          if(streamClosed) return writeStream.closeWrite(streamClosed.err)

          transformFunction(data, function(err, transformedData) {
            if(err) return writeStream.closeWrite(err)

            writeStream.write(transformedData)
            doPipe()
          })
        })
      })
    }

    doPipe()

    callback(null, transformedStream)
  }

  var transformMethod = 'to' + transformName + 'Stream'
  var streamableToTransformedStream = function(streamable, callback) {
    if(streamable[transformMethod]) return streamable[transformMethod](callback)

    streamToTransformedStream(streamable.toStream(), function(err, transformedStream) {
      if(err) return callback(err)

      if(streamable.reusable && !streamable[transformMethod]) {
        var transformedStreamable = streamableConvert.streamToReusableStreamable(transformedStream)

        streamable[transformMethod] = function(callback) {
          callback(null, transformedStreamable.toStream())
        }

        callback(null, transformedStreamable.toStream())
      } else {
        callback(null, transformedStreamable)
      }
    })
  }

  var transformer = {
    streamToTransformedStream: streamToTransformedStream,
    streamableToTransformedStream: streamableToTransformedStream
  }

  var streamToTransformedStreamMethod = 'streamTo' + transformName + 'Stream'
  transformer[streamToTransformedStreamMethod] = streamToTransformedStream

  streamableToTransformedStreamMethod = 'streamableTo' + transformName + 'Stream'
  transformer[streamableToTransformedStreamMethod] = streamableToTransformedStream

  return transformer
}

module.exports = {
  createStreamTransformer: createStreamTransformer
}