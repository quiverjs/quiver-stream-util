import { resolve } from 'quiver-promise'

export var pushbackStream = (readStream, buffers) => {
  if(readStream.pushback) {
    readStream.pushback(buffers)
    return readStream
  }

  var newReadStream = Object.create(readStream)

  newReadStream.read = () => {
    if(buffers.length == 0) {
      return readStream.read()
    } else {
      return resolve({ data: buffers.shift() })
    }
  }

  newReadStream.closeRead = err => {
    buffers = []
    return readStream.CloseRead(err)
  }

  newReadStream.pushback = moreBuffers => {
    buffers = moreBuffers.concat(buffers)
  }

  return newReadStream
}