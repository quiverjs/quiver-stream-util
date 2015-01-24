import { resolve, promisify } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'

export let streamToBuffers = readStream => {
  let buffers = [ ]

  let doPipe = (callback) =>
    readStream.read().then(({ closed, data }) => {
      if(closed) return callback(null, buffers)

      buffers.push(data)
      doPipe(callback)
    }, callback)

  return promisify(doPipe)()
}

export let streamableToBuffers = streamable => {
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

export let buffersToStream = buffers => {
  let { readStream, writeStream } = createChannel()

  buffers.forEach(buffer => writeStream.write(buffer))
  writeStream.closeWrite()

  return readStream
}

export let buffersToStreamable = buffers => ({
  reusable: true,
  toBuffers: () => resolve(buffers.slice()),
  toStream: () => resolve(buffersToStream(buffers))
})