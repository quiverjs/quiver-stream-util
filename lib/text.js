import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'
import { streamToBuffer, streamableToBuffer, bufferToStreamable } from './buffer.js'

export var streamToText = readStream =>
  streamToBuffer(readStream).then(buffer =>
    buffer.toString())

export var streamableToText = streamable => {
  if(streamable.toText) return resolve(streamable.toText())

  return streamableToBuffer(streamable).then(buffer => {
    var text = buffer.toString()
    
    if(streamable.reusable && !streamable.toText) {
      streamable.toText = () => resolve(text)
    }

    return text
  })
}

export var textToStream = text => {
  var { readStream, writeStream } = createChannel()

  writeStream.write(new Buffer(text))
  writeStream.closeWrite()

  return readStream
}

export var textToStreamable = text => {
  var streamable = bufferToStreamable(new Buffer(text))
  streamable.contentType = 'text/plain'

  return streamable
}