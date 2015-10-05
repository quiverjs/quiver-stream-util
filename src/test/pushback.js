import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  streamToText,
  buffersToStream,
  pushbackStream
} from '../lib'

test('stream pushback test', assert => {
  assert::asyncTest('should emit pushed back buffers first', async function(assert) {
    const testBuffers = ['foo ', 'bar']
    const pushbackBuffers = ['before1 ', 'before2 ']

    let readStream = buffersToStream(testBuffers)
    readStream = pushbackStream(readStream, pushbackBuffers)

    let { data } = await readStream.peek()
    assert.equal(data, 'before1 ')

    ;({ data } = await readStream.peek())
    assert.equal(data, 'before1 ')

    const text = await streamToText(readStream)
    assert.equal(text, 'before1 before2 foo bar')

    assert.end()
  })

  assert::asyncTest('nested stream pushback test', async function(assert) {
    const testBuffers = ['six ', 'seven']
    let readStream = buffersToStream(testBuffers)

    readStream = pushbackStream(readStream, ['four ', 'five '])
    readStream = pushbackStream(readStream, ['three '])
    readStream = pushbackStream(readStream, ['one ', 'two '])

    const text = await streamToText(readStream)
    assert.equal(text, 'one two three four five six seven')

    assert.end()
  })
})
