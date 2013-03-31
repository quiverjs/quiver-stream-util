
var textConvert = require('./text')
var jsonConvert = require('./json')
var buffersConvert = require('./buffers')
var streamableConvert = require('./streamable')

module.exports = {
  streamToText: textConvert.streamToText,
  textToStream: textConvert.textToStream,
  streamableToText: textConvert.streamableToText,
  textToStreamable: textConvert.textToStreamable,

  streamToJson: jsonConvert.streamToJson,
  jsonToStream: jsonConvert.jsonToStream,
  streamableToJson: jsonConvert.streamableToJson,
  jsonToStreamable: jsonConvert.jsonToStreamable,

  streamToBuffers: buffersConvert.streamToBuffers,
  buffersToStream: buffersConvert.buffersToStream,
  streamableToBuffers: buffersConvert.streamableToBuffers,
  buffersToStreamable: buffersConvert.buffersToStreamable,
  
  streamToStreamable: streamableConvert.streamToStreamable,
  streamToReusableStreamable: streamableConvert.streamToReusableStreamable,
  createReusableStreamable: streamableConvert.createReusableStreamable
}