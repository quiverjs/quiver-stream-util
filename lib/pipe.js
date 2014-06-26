import { resolve, reject } from 'quiver-promise'

export var pipeStream = (readStream, writeStream) => {
  var doPipe = () => 
    writeStream.prepareWrite().then(({closed}) => {
      if(closed) {
        readStream.closeRead()
        return resolve()
      }

      return readStream.read().then(({closed, data}) => {
        if(closed) {
          writeStream.closeWrite()
          return resolve()
        }

        writeStream.write(data)
        return doPipe()
        
      }, err => {
        writeStream.closeWrite(err)
        return reject(err)
      })
    }, err => {
      readStream.closeRead(err)
      return reject(err)
    })

  return doPipe()
}