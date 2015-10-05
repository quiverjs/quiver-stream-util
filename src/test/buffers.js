import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  reuseStream, streamToBuffers,
  streamableToText, buffersToStreamable
} from '../lib/'

const testBuffers = [ 'foo', 'bar', 'baz' ]

test('basic buffer test', assert => {
  const streamable = buffersToStreamable(testBuffers)

  assert::asyncTest('should convert buffers to stream', async function(assert) {
    const readStream = await streamable.toStream()

    let {closed, data} = await readStream.read()
    assert.equal(data, testBuffers[0])

    ;({closed, data} = await readStream.read())
    assert.equal(data, testBuffers[1])

    ;({closed, data} = await readStream.read())
    assert.equal(data, testBuffers[2])

    ;({closed, data} = await readStream.read())
    assert.ok(closed)

    assert.end()
  })

  assert::asyncTest('should be convertible to string', async function(assert) {
    const text = await streamableToText(streamable)
    assert.equal(text, 'foobarbaz')
    assert.end()
  })

  assert::asyncTest('convert buffers stream into reusable streamable', async function(assert) {
    const streamable2 = reuseStream(await streamable.toStream())

    const buffers = await streamToBuffers(await streamable2.toStream())
    assert.deepEqual(buffers, testBuffers)

    // call toStream() again
    const buffers2 = await streamToBuffers(await streamable2.toStream())
    assert.deepEqual(buffers2, testBuffers)
    assert.end()
  })
})
