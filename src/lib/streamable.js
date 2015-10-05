import { createChannel } from 'quiver-stream-channel'

import { streamOpener } from './util'
import { buffersToStream } from './buffers'

export const closeStreamable = async function(streamable) {
  if(streamable.reusable) return

  const readStream = await streamable.toStream()
  return readStream.closeRead()
}

export const streamToStreamable = readStream => {
  const openStream = streamOpener()

  return {
    reusable: false,

    async toStream() {
      openStream()
      return readStream
    }
  }
}

const buffersToToStream = buffers =>
  async function() {
    return buffersToStream(buffers)
  }

export const reuseStream = readStream => {
  const streamable = {
    reusable: true
  }

  let isClosed = false
  let closedErr = null

  const buffers = []
  let pendingWrites = []

  const toStream = streamable.toStream = async function() {
    if(closedErr) throw closedErr
    if(isClosed) return buffersToStream(buffers)

    const { readStream, writeStream } = createChannel()

    for(let buffer of buffers)
      writeStream.write(buffer)

    pendingWrites.push(writeStream)

    return readStream
  }

  const doPipe = async function() {
    try {
      while(true) {
        const { data, closed } = await readStream.read()
        if(!closed) {
          buffers.push(data)
          for(let writeStream of pendingWrites)
            writeStream.write(data)

        } else {
          isClosed = true
          for(let writeStream of pendingWrites)
            writeStream.closeWrite()

          if(streamable.toStream === toStream)
            streamable.toStream = buffersToToStream(buffers)

          pendingWrites = []
          return
        }

      }
    } catch(err) {
      isClosed = true
      closedErr = err

      for(let writeStream of pendingWrites) {
        writeStream.closeWrite(err)
        streamable.toStream = () => Promise.reject(err)
      }
    }
  }

  doPipe()

  return streamable
}

export const reuseStreamable = async function(streamable) {
  if(streamable.reusable) return streamable

  const readStream = await streamable.toStream()
  return reuseStream(readStream)
}

export const unreuseStreamable = streamable => {
  if(!streamable.reusable) return streamable

  const oldToStream = streamable.toStream

  streamable.reusable = false

  const openStream = streamOpener()

  streamable.toStream = async function() {
    openStream()
    return oldToStream()
  }

  return streamable
}
