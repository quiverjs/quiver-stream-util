import { createChannel } from 'quiver-stream-channel'
import { streamToBuffers, streamableToBuffers } from './buffers.js'

var nodeBuffers = buffers =>
  buffers.map(buffer =>
    (buffer instanceof Buffer) ? buffer : new Buffer(buffer))

var buffersToBuffer = buffers =>
  Buffer.concat(nodeBuffers(buffers))

export var streamToBuffer = readStream =>
  streamToBuffers(readStream).then(buffersToBuffer)

export var streamableToBuffer = streamable => {
  if(streamable.toBuffer) return resolve(streamable.toBuffer())

  return streamable.toStream().then(readStream =>
    streamableToBuffers(readStream).then(buffersToBuffer)
    .then(buffer => {
      if(streamable.reusable && !streamable.toBuffer) {
        streamable.toBuffer = () => resolve(buffer)
      }

      return buffer
    }))
}

export var bufferToStream = buffer => {
  var { readStream, writeStream } = createChannel()

  writeStream.write(buffer)
  writeStream.closeWrite(null)

  return readStream
}

export var bufferToStreamable = buffer => ({
  reusable: true,
  contentLength: buffer.length,
  toBuffer: () => resolve(buffer),
  toBuffers: () => resolve([buffer]),
  toStream: () => resolve(bufferToStream(buffer))
})