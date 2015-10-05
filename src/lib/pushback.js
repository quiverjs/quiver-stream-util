export const pushbackStream = (readStream, buffers=[]) => {
  if(readStream.pushback) {
    readStream.pushback(buffers)
    return readStream
  }

  const newReadStream = Object.create(readStream)

  const doRead = async function() {
    if(buffers.length > 0) {
      return { data: buffers.shift() }
    } else {
      return readStream.read()
    }
  }

  newReadStream.read = doRead

  newReadStream.closeRead = err => {
    buffers = []
    return readStream.closeRead(err)
  }

  newReadStream.pushback = moreBuffers => {
    buffers = moreBuffers.concat(buffers)
  }

  newReadStream.peek = async function() {
    if(buffers[0])
      return { data: buffers[0] }

    const { data, closed } = await doRead()
    if(closed) return { closed }

    buffers.push(data)
    return { data }
  }

  return newReadStream
}
