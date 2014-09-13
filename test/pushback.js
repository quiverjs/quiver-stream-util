import 'traceur'

import { async } from 'quiver-promise'
import {
  streamToText,
  buffersToStream,
  pushbackStream
} from '../lib/stream-util.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('stream pushback test', () => {
  it('should emit pushed back buffers first', async(function*() {
    var testBuffers = ['foo ', 'bar']
    var pushbackBuffers = ['before1 ', 'before2 ']

    var readStream = buffersToStream(testBuffers)
    readStream = pushbackStream(readStream, pushbackBuffers)

    var { data } = yield readStream.peek()
    data.should.equal('before1 ')

    var { data } = yield readStream.peek()
    data.should.equal('before1 ')

    yield streamToText(readStream).should.eventually.equal(
      'before1 before2 foo bar')
  }))

  it('nested stream pushback test', async(function*() {
    var testBuffers = ['six ', 'seven']
    var readStream = buffersToStream(testBuffers)

    readStream = pushbackStream(readStream, ['four ', 'five '])
    readStream = pushbackStream(readStream, ['three '])
    readStream = pushbackStream(readStream, ['one ', 'two '])

    yield streamToText(readStream).should.eventually.equal(
      'one two three four five six seven')
  }))
})