import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'
import { 
  streamToBuffers, streamableToBuffers 
} from './buffers'

let nodeBuffers = buffers =>
  buffers.map(buffer =>
    (buffer instanceof Buffer) ? buffer : new Buffer(buffer))

let buffersToBuffer = buffers =>
  Buffer.concat(nodeBuffers(buffers))

export let streamToBuffer = readStream =>
  streamToBuffers(readStream).then(buffersToBuffer)

export let streamableToBuffer = streamable => {
  if(streamable.toBuffer) return resolve(streamable.toBuffer())

  return streamableToBuffers(streamable).then(buffersToBuffer)
    .then(buffer => {
      if(streamable.reusable && !streamable.toBuffer) {
        streamable.toBuffer = () => resolve(buffer)
      }

      return buffer
    })
}

export let bufferToStream = buffer => {
  if(!Buffer.isBuffer(buffer)) 
    buffer = new Buffer(buffer)
  
  let { readStream, writeStream } = createChannel()

  writeStream.write(buffer)
  writeStream.closeWrite(null)

  return readStream
}

export let toBufferToStreamable = (toBuffer) => ({
  reusable: true,
  get contentLength() {
    return toBuffer().length
  },
  toBuffer: () => resolve(toBuffer()),
  toBuffers: () => resolve([toBuffer()]),
  toStream: () => resolve(bufferToStream(toBuffer()))
})

export let bufferToStreamable = buffer => {
  if(!Buffer.isBuffer(buffer)) 
    buffer = new Buffer(buffer)

  return toBufferToStreamable(() => buffer)
}
