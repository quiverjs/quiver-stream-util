import { resolve } from 'quiver-util/promise'
import { createChannel } from 'quiver-stream-channel'
import {
  streamToBuffer, streamableToBuffer,
  bufferToStreamable
} from './buffer'

export const streamToText = async function(readStream) {
  const buffer = await streamToBuffer(readStream)
  return buffer.toString()
}

export const streamableToText = async function(streamable) {
  if(streamable.toText) return streamable.toText()

  const buffer = await streamableToBuffer(streamable)
  const text = buffer.toString()

  if(streamable.reusable && !streamable.toText)
    streamable.toText = () => resolve(text)

  return text
}

export const textToStream = text => {
  const { readStream, writeStream } = createChannel()

  writeStream.write(new Buffer(text))
  writeStream.closeWrite()

  return readStream
}

export const textToStreamable = (text, contentType='text/plain') => {
  if(typeof(text) !== 'string')
    throw new TypeError('argument must be string')

  const buffer = new Buffer(text)
  const streamable = bufferToStreamable(buffer, contentType)

  streamable.toText = () => resolve(text)
  streamable.contentType = contentType

  return streamable
}
