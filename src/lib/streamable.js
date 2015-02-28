import { error } from 'quiver-error'
import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'
import { buffersToStream } from './buffers'

export let closeStreamable = streamable => {
  if(streamable.reusable) return resolve()

  return streamable.toStream()
  .then(readStream => 
    readStream.closeRead())
}

export let streamToStreamable = readStream => {
  let opened = false

  return {
    reusable: false,
    toStream: () => {
      if(opened) return reject(error(500,
        'streamable can only be opened once'))

      opened = true
      return resolve(readStream)
    }
  }
}

export let reuseStream = readStream => {
  let streamable = {
    reusable: true
  }

  let buffers = []
  let pendingWrites = []

  streamable.toStream = () => {
    let { readStream, writeStream } = createChannel()
    buffers.forEach(buffer => writeStream.write(buffer))
    pendingWrites.push(writeStream) 
    return resolve(readStream)
  }

  let doPipe = () => {
    readStream.read().then(({ closed, data }) => {
      if(closed) {
        pendingWrites.forEach(writeStream => 
          writeStream.closeWrite())

        let allBuffers = buffers
        streamable.toStream = () => 
          resolve(buffersToStream(allBuffers))

      } else {
        buffers.push(data)

        pendingWrites.forEach(writeStream =>
          writeStream.write(data))

        doPipe()
      }

    }, err => {
      pendingWrites.forEach(writeStream => 
        writeStream.closeWrite(err))
      
      streamable.toStream = () => reject(err)
    })
  }

  doPipe()

  return streamable
}

export let reuseStreamable = streamable => {
  if(streamable.reusable) return resolve(streamable)

  return streamable.toStream().then(reuseStream)
}

export let unreuseStreamable = streamable => {
  if(!streamable.reusable) return streamable

  let oldToStream = streamable.toStream

  streamable.reusable = false

  let opened = false
  streamable.toStream = () => {
    if(opened) return rreject(error(500,
        'streamable can only be opened once'))

    opened = true
    return oldToStream()
  }

  return streamable
}