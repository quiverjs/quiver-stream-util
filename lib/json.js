
var error = require('quiver-error').error
var createChannel = require('quiver-stream-channel').createStreamChannel
var textConvert = require('./text')

var parseJson = function(text) {
  try {
    var json = JSON.parse(text)
    return { json: json }
  } catch(err) {
    return { err: error(500, 'error parsing json stream', err) }
  }
}

var streamToJson = function(readStream, callback) {
  textConvert.streamToText(readStream, function(err, text) {
    if(err) return callback(err)

    var res = parseJson(text)
    if(res.err) return callback(res.err)

    callback(null, res.json)
  })
}

var streamableToJson = function(streamable, callback) {
  if(streamable.toJson) return streamable.toJson(callback)

  textConvert.streamableToText(streamable, function(err, text) {
    if(err) return callback(err)

    var res = parseJson(text)
    if(res.err) return callback(res.err)

    callback(null, res.json)
  })
}

var jsonToStreamable = function(json) {
  var streamable = { }
  streamable.reusable = true

  var jsonText = JSON.stringify(json)

  streamable.toText = function(callback) {
    callback(null, jsonText)
  }

  streamable.toJson = function(callback) {
    callback(null, json)
  }

  streamable.toStream = function() {
    var channel = createChannel()
    var readStream = channel.readStream
    var writeStream = channel.writeStream

    writeStream.write(jsonText.slice())
    writeStream.closeWrite(null)

    return readStream
  }

  return streamable
}

module.exports = {
  streamToJson: streamToJson,
  streamableToJson: streamableToJson,
  jsonToStreamable: jsonToStreamable
}
