import { resolve } from 'quiver-util/promise'
import { createChannel } from 'quiver-stream-channel'
import {
  streamToBuffers, streamableToBuffers
} from './buffers'

const nodeBuffers = buffers =>
  buffers.map(buffer => {
    if(Buffer.isBuffer(buffer)) return buffer

    return new Buffer(buffer)
  })

const concatBuffers = buffers =>
  Buffer.concat(nodeBuffers(buffers))

export const streamToBuffer = readStream =>
  streamToBuffers(readStream).then(concatBuffers)

export const streamableToBuffer = async function(streamable) {
  if(streamable.toBuffer) return streamable.toBuffer()

  const buffers = await streamableToBuffers(streamable)
  const buffer = concatBuffers(buffers)

  if(streamable.reusable && !streamable.toBuffer)
    streamable.toBuffer = () => resolve(buffer)

  return buffer
}

export const bufferToStream = buffer => {
  if(!Buffer.isBuffer(buffer))
    buffer = new Buffer(buffer)

  const { readStream, writeStream } = createChannel()

  writeStream.write(buffer)
  writeStream.closeWrite()

  return readStream
}

export const bufferToStreamable = (buffer, contentType='application/octet-stream') => {
  const contentLength = buffer.length
  return {
    reusable: true,
    contentType,
    contentLength,

    async toBuffer() {
      return buffer
    },

    async toBuffers() {
      return [buffer]
    },

    async toStream() {
      return bufferToStream(buffer)
    }
  }
}
