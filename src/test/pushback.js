import 'traceur'

import { async } from 'quiver-promise'
import {
  streamToText,
  buffersToStream,
  pushbackStream
} from '../lib/stream-util'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('stream pushback test', () => {
  it('should emit pushed back buffers first', async(function*() {
    let testBuffers = ['foo ', 'bar']
    let pushbackBuffers = ['before1 ', 'before2 ']

    let readStream = buffersToStream(testBuffers)
    readStream = pushbackStream(readStream, pushbackBuffers)

    var { data } = yield readStream.peek()
    data.should.equal('before1 ')

    var { data } = yield readStream.peek()
    data.should.equal('before1 ')

    yield streamToText(readStream).should.eventually.equal(
      'before1 before2 foo bar')
  }))

  it('nested stream pushback test', async(function*() {
    let testBuffers = ['six ', 'seven']
    let readStream = buffersToStream(testBuffers)

    readStream = pushbackStream(readStream, ['four ', 'five '])
    readStream = pushbackStream(readStream, ['three '])
    readStream = pushbackStream(readStream, ['one ', 'two '])

    yield streamToText(readStream).should.eventually.equal(
      'one two three four five six seven')
  }))
})