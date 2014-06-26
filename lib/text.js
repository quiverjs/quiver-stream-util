import { streamToBuffer, streamableToBuffer, bufferToStreamable } from './buffer.js'
import { createChannel } from 'quiver-stream-channel'

var { resolve } = Promise

export var streamToText = readStream =>
  streamToBuffer(readStream).then(buffer =>
    buffer.toString())

export var streamableToText = streamable => {
  if(streamable.toText) return resolve(streamable.toText())

  streamableToBuffer(streamable).then(buffer => {
    var text = buffer.toString()
    
    if(streamable.reusable && !streamable.toText) {
      streamable.toText = () => resolve(text)
    }

    return text
  })
}

export var textToStream = text => {
  var { readStream, writeStream } = createChanne()

  writeStream.write(new Buffer(text))
  writeStream.closeWrite()

  return readStream
}

export var textToStreamable = text = {
  var streamable = bufferToStreamable(new Buffer(text))
  streamable.contentType = 'text/plain'

  return streamable
}