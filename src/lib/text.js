import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'
import { 
  streamToBuffer, streamableToBuffer, 
  toBufferToStreamable 
} from './buffer'

export let streamToText = readStream =>
  streamToBuffer(readStream).then(buffer =>
    buffer.toString())

export let streamableToText = streamable => {
  if(streamable.toText) return resolve(streamable.toText())

  return streamableToBuffer(streamable).then(buffer => {
    let text = buffer.toString()
    
    if(streamable.reusable && !streamable.toText) {
      streamable.toText = () => resolve(text)
    }

    return text
  })
}

export let textToStream = text => {
  let { readStream, writeStream } = createChannel()

  writeStream.write(new Buffer(text))
  writeStream.closeWrite()

  return readStream
}

export let toTextToStreamable = (toText, contentType='text/plain') => {
  let buffer = null

  let toBuffer = () => {
    if(!buffer) buffer = new Buffer(toText())

    return buffer
  }

  let streamable = toBufferToStreamable(toBuffer)

  streamable.toText = () => resolve(toText())
  streamable.contentType = contentType

  return streamable
}

export let textToStreamable = (text, contentType='text/plain') =>
  toTextToStreamable(() => text, contentType)