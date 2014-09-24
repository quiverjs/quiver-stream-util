import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'
import { 
  streamToBuffer, streamableToBuffer, 
  toBufferToStreamable 
} from './buffer.js'

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

export var toTextToStreamable = (toText, contentType='text/plain') => {
  var buffer = null

  var toBuffer = () => {
    if(!buffer) buffer = new Buffer(toText())

    return buffer
  }

  var streamable = toBufferToStreamable(toBuffer)

  streamable.toText = () => resolve(toText())
  streamable.contentType = contentType

  return streamable
}

export var textToStreamable = (text, contentType='text/plain') =>
  toTextToStreamable(() => text, contentType)