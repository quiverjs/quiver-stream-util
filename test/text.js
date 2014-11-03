import 'traceur'
import { createChannel } from 'quiver-stream-channel'
import {
  streamToText
} from '../lib/stream-util'

var chai = require('chai')
var should = chai.should()

var testString = '世界你好'
var testBuffer = new Buffer(testString)
var buffer1 = testBuffer.slice(0, 5)
var buffer2 = testBuffer.slice(5, 10)
var buffer3 = testBuffer.slice(10, 12)

describe('unicode text test', function() {
  it('buffer to string then concat should not equal original', () => {
    var result = '' + buffer1 + '' + buffer2 + '' + buffer3
    result.should.not.equal(testString) 
  })

  it('buffer concat then to string should equal original', () => {
    var buffer = Buffer.concat([buffer1, buffer2, buffer3])
    var result = ''+buffer
    result.should.equal(testString)
  })

  it('stream to text should equal original', () => {
    var { readStream, writeStream } = createChannel()

    writeStream.write(buffer1)
    writeStream.write(buffer2)
    writeStream.write(buffer3)
    writeStream.closeWrite()

    return streamToText(readStream).then(text => 
      text.should.equal(testString))
  })
})