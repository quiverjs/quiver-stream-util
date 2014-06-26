import { buffersToStream } from './buffers.js'
import { error } from 'quiver-error'
import { createChannel } from 'quiver-stream-channel'

export var streamToStreamable = readStream => {
  var opened = false

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

export var reuseStream = readStream => {
  var streamable = {
    reusable: true
  }

  var buffers = []
  var pendingWrites = []

  streamable.toStream = () => {
    var { readStream, writeStream } = createChannel()
    buffers.forEach(buffer => writeStream.write(buffer))
    pendingWrites.push(writeStream)
    return resolve(readStream)
  }

  var doPipe = () => {
    readStream.read().then({ closed, data } => {
      if(closed) {
        pendingWrites.forEach(writeStream => 
          writeStream.closeWrite())

        var allBuffers = buffers
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

  return streamable
}

export var reuseStreamable = streamable => {
  if(streamable.reusable) return resolve(streamable)

  return streamable.toStream().then(reuseStream)
}
