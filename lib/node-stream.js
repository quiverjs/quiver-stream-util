import { createChannel } from 'quiver-stream-channel'
import { resolve, createPromise } from 'quiver-promise'

export var nodeToQuiverReadStream = nodeRead => {
  var { readStream, writeStream } = createChannel()

  var ended = false

  nodeRead.on('end', () => {
    if(ended) return
    writeStream.closeWrite()
    ended = true
  })

  nodeRead.on('error', err => {
    if(ended) return
    writeStream.closeWrite(err)
    ended = true
  })

  var doRead = () => {
    if(ended) return resolve({ended})

    var data = nodeRead.read()
    if(data) return resolve({data})

    return createPromise((resolve) =>
      nodeRead.once('readable', () => 
        resolve(doRead())))
  }

  var doPipe = () =>
    writeStream.prepareWrite().then(({closed}) => {
      if(closed || ended) return

      return doRead().then(({ended, data}) => {
        if(ended) return writeStream.closeWrite()

        writeStream.write(data)
        return doPipe()
      })
    })

  doPipe().catch(err => { /*ignore*/ })

  return readStream
}

export var nodeToQuiverWriteStream = nodeWrite => {
  var { readStream, writeStream } = createChannel()

  nodeWrite.on('error', err =>
    readStream.closeRead(err))

  var doPipe = () =>
    readStream.read().then(({closed, data}) => {
      if(closed) return nodeWrite.end()

      var ready = nodeWrite.write(data)
      if(ready) return doPipe()
      
      return createPromise((resolve) =>
        nodeWrite.once('drain', () =>
          resolve(doPipe())))

    }, err => nodeWrite.end())

  doPipe().catch(err => { /*ignore*/ })

  return writeStream
}