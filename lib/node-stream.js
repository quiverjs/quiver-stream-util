import { error } from 'quiver-error'
import { resolve, reject } from 'quiver-promise'
import { createChannel } from 'quiver-stream-channel'

var noop = () => { }

export var nodeReadToStreamable = nodeRead => {
  var opened = false

  var toStream = () => {
    if(opened) return reject(error(500, 
      'streamable can only be opened once'))

    opened = true
    return resolve(nodeToQuiverReadStream(nodeRead))
  }

  var toNodeStream = () => {
    if(opened) return reject(error(500, 
      'streamable can only be opened once'))

    opened = true
    return resolve(nodeRead)
  }

  return {
    reusable: false,
    toStream,
    toNodeStream
  }
}

export var nodeToQuiverReadStream = nodeRead => {
  var { readStream, writeStream } = createChannel()

  var ended = false

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

  var doRead = (callback) => {
    if(ended) return

    var data = nodeRead.read()
    if(data) return callback(data)

    nodeRead.once('readable', () => doRead(callback))
  }

  var doPipe = () =>
    writeStream.prepareWrite().then(({closed}) => {
      // force the node read stream into flowing mode 
      // because there is no way to cancel a node read stream?!
      if(closed) return nodeRead.resume()

      doRead(data => {
        writeStream.write(data)
        doPipe()
      })
    })

  doPipe()

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
      
      nodeWrite.once('drain', doPipe)
    }, err => nodeWrite.end())

  doPipe()
  
  return writeStream
}