import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import { createChannel } from 'quiver-stream-channel'
import { streamToText } from '../lib'

const testString = '世界你好'
const testBuffer = new Buffer(testString)
const buffer1 = testBuffer.slice(0, 5)
const buffer2 = testBuffer.slice(5, 10)
const buffer3 = testBuffer.slice(10, 12)

test('unicode text test', assert => {
  assert.test('buffer to string then concat should not equal original', assert => {
    const result = '' + buffer1 + '' + buffer2 + '' + buffer3
    assert.notEqual(result, testString)
    assert.end()
  })

  assert.test('buffer concat then to string should equal original', assert => {
    const buffer = Buffer.concat([buffer1, buffer2, buffer3])
    const result = ''+buffer
    assert.equal(result, testString)
    assert.end()
  })

  assert::asyncTest('stream to text should equal original', async function(assert) {
    const { readStream, writeStream } = createChannel()

    writeStream.write(buffer1)
    writeStream.write(buffer2)
    writeStream.write(buffer3)
    writeStream.closeWrite()

    const text = await streamToText(readStream)
    assert.equal(text, testString)

    assert.end()
  })
})
