import 'traceur'
import { emptyReadStream, emptyWriteStream } from '../lib/empty.js'

var should = require('should')

describe('empty stream test', () => {
  it('test empty read stream', () => {
    var readStream = emptyReadStream()

    should.exist(readStream.isClosed())
    
    return readStream.read().then(({closed, data}) => {
      should.exist(closed)
      should.not.exist(data)
    })
  })

  it('test empty write stream', () => {
    var writeStream = emptyWriteStream()
    
    writeStream.write('ignored data')
    should.exist(writeStream.isClosed())

    return writeStream.prepareWrite().then(({closed}) => {
      should.exist(closed)
    })
  })
})