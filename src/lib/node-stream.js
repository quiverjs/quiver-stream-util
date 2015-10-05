import { createChannel } from 'quiver-stream-channel'

import { streamOpener } from './util'

const waitEvent = (event, eventName) =>
  new Promise(resolve =>
    event.once(eventName, resolve))

export const nodeReadToStreamable = nodeRead => {
  const openStream = streamOpener()

  const toStream = async function() {
    openStream()
    return nodeToQuiverReadStream(nodeRead)
  }

  const toNodeStream = async function() {
    openStream()
    return nodeRead
  }

  return {
    reusable: false,
    toStream,
    toNodeStream
  }
}

export const nodeToQuiverReadStream = nodeRead => {
  const { readStream, writeStream } = createChannel()

  let ended = false

  nodeRead.on('end', () => {
    if(ended) return
    ended = true
    writeStream.closeWrite()
  })

  nodeRead.on('error', err => {
    if(ended) return
    ended = true
    writeStream.closeWrite(err)
  })

  const doRead = async function() {
    while(true) {
      if(ended) return { closed: true }

      const data = nodeRead.read()
      if(data) return { data }

      await waitEvent(nodeRead, 'readable')
    }
  }

  const doPipe = async function() {
    try {
      while(true) {
        const { closed: writeClosed } = await writeStream.prepareWrite()

        // force the node read stream into flowing mode
        // because there is no way to cancel a node read stream
        if(writeClosed) return nodeRead.resume()

        const { data, closed: readClosed } = await doRead()

        if(readClosed) return

        writeStream.write(data)
      }
    } catch(err) {
      nodeRead.resume()
      writeStream.closeWrite(err)
    }
  }

  doPipe()

  return readStream
}

export const nodeToQuiverWriteStream = nodeWrite => {
  const { readStream, writeStream } = createChannel()

  nodeWrite.on('error', err =>
    readStream.closeRead(err))

  const doPipe = async function() {
    try {
      while(true) {
        const { data, closed } = await readStream.read()
        if(closed) return nodeWrite.end()

        const ready = nodeWrite.write(data)

        if(!ready) await waitEvent(nodeWrite, 'drain')
      }

    } catch(err) {
      nodeWrite.end()
      readStream.closeRead(err)
    }
  }

  doPipe()

  return writeStream
}
