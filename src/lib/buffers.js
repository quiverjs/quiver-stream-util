import { resolve } from 'quiver-util/promise'
import { createChannel } from 'quiver-stream-channel'

export const streamToBuffers = async function(readStream) {
  const buffers = [ ]

  while(true) {
    const { data, closed } = await readStream.read()
    if(closed) return buffers
    buffers.push(data)
  }
}

export const streamableToBuffers = async function(streamable) {
  if(streamable.toBuffers) return streamable.toBuffers()

  const readStream = await streamable.toStream()
  const buffers = await streamToBuffers(readStream)

  if(!streamable.reusable || streamable.toBuffers)
    return buffers

  streamable.toBuffers = () => resolve(buffers.slice())
  return buffers.slice()
}

export const buffersToStream = buffers => {
  const { readStream, writeStream } = createChannel()

  for(let buffer of buffers) {
    writeStream.write(buffer)
  }

  writeStream.closeWrite()

  return readStream
}

export const buffersToStreamable = buffers => {
  return {
    reusable: true,

    async toBuffers() {
      return buffers.slice()
    },

    async toStream() {
      return buffersToStream(buffers)
    }
  }
}
