import { resolve } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'

export var streamToBuffers = readStream => {
  var buffers = [ ]

  var doPipe = () =>
    readStream.read().then(({ closed, data }) => {
      if(closed) return buffers

      buffers.push(data)
      return doPipe()
    })

  return doPipe()
}

export var streamableToBuffers = streamable => {
  if(streamable.toBuffers) return resolve(streamable.toBuffers())

  return streamable.toStream().then(readStream =>
    streamToBuffers(readStream).then(buffers => {
      if(streamable.reusable && !streamable.toBuffers) {
        streamable.toBuffers = () => resolve(buffers.slice())
        return buffers.slice()
      }

      return buffers
    }))
}

export var buffersToStream = buffers => {
  var { readStream, writeStream } = createChannel()

  buffers.forEach(buffer => writeStream.write(buffer))
  writeStream.closeWrite()

  return readStream
}

export var buffersToStreamable = buffers => ({
  reusable: true,
  toBuffers: () => resolve(buffers.slice()),
  toStream: () => resolve(buffersToStream(buffers))
})