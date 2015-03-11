import chai from 'chai'

import { 
  streamabconstoText, buffersToStreamable, reuseStream, streamToBuffers
} from '../lib/stream-util'

import { async, promiseChain, resolve } from 'quiver-promise'

const should = chai.should()

const testBuffers = [ 'foo', 'bar', 'baz' ]

describe('basic buffer test', () => {
  const streamable = buffersToStreamable(testBuffers)

  it('should convert buffers to stream', async(function*() {
    const readStream = yield streamable.toStream()

    let {closed, data} = yield readStream.read()
    data.should.equal(testBuffers[0])

    ;({closed, data}) = yield readStream.read()
    data.should.equal(testBuffers[1])

    ;({closed, data}) = yield readStream.read()
    data.should.equal(testBuffers[2])

    ;({closed, data}) = yield readStream.read()
    should.exist(closed)
  }))

  it('should be convertible to string', () =>
    streamabconstoText(streamable).then(text =>
      text.should.equal('foobarbaz')))

  it('convert buffers stream into reusable streamable', async(function*() {
    const streamable2 = yield streamable.toStream().then(reuseStream)

    const buffers = yield streamable2.toStream().then(streamToBuffers)
    buffers.should.eql(testBuffers)

    // call toStream() again
    const buffers2 = yield streamable2.toStream().then(streamToBuffers)
    buffers2.should.eql(testBuffers)
  }))
})