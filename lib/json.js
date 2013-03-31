
var error = require('quiver-error').error
var createChannel = require('quiver-stream-channel').createStreamChannel
var copyObject = require('quiver-copy').copyObject
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

var addStreamableToJson = function(streamable, json) {
  streamable.toJson = function(callback) {
    process.nextTick(function() {
      callback(null, copyObject(json))
    })
  }
}

var streamableToJson = function(streamable, callback) {
  if(streamable.toJson) return streamable.toJson(callback)

  textConvert.streamableToText(streamable, function(err, text) {
    if(err) return callback(err)

    var res = parseJson(text)
    if(res.err) return callback(res.err)

    var json = res.json
    if(streamable.reusable && !streamable.toJson) {
      addStreamableToJson(streamable, json)
    }

    callback(null, json)
  })
}

var jsonToStream = function(json) {
  var channel = createChannel()
  var readStream = channel.readStream
  var writeStream = channel.writeStream

  var jsonText = JSON.stringify(json)

  writeStream.write(jsonText)
  writeStream.closeWrite(null)

  return readStream
}

var jsonToStreamable = function(json) {
  var streamable = { }
  streamable.reusable = true

  var jsonText = JSON.stringify(json)

  streamable.toText = function(callback) {
    callback(null, jsonText)
  }

  addStreamableToJson(streamable, json)

  streamable.toStream = function() {
    return textConvert.textToStream(jsonText.slice())
  }

  return streamable
}

module.exports = {
  streamToJson: streamToJson,
  streamableToJson: streamableToJson,
  jsonToStreamable: jsonToStreamable,
  jsonToStream: jsonToStream
}
