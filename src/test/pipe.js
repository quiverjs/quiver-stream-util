import test from 'tape'
import { asyncTest, rejected } from 'quiver-util/tape'

import {
  pipeStream, createChannel,
  buffersToStream, streamToText
} from '../lib'

const buffers = ['one ', 'two ', 'three']

test('pipestream test', assert => {
  assert::asyncTest('should pipe successfully', async function(assert) {
    const sourceStream = buffersToStream(buffers)
    const { writeStream, readStream } = createChannel()

    const p1 = pipeStream(sourceStream, writeStream)

    const p2 = streamToText(readStream).then(text =>
      assert.equal(text, 'one two three'))

    await Promise.all([p1, p2])

    assert.end()
  })

  assert::asyncTest('should write fail', async function(assert) {
    const {
      writeStream: writeStream1,
      readStream: readStream1
    } = createChannel()

    const {
      writeStream: writeStream2,
      readStream: readStream2
    } = createChannel()

    const p1 = assert::rejected(pipeStream(readStream1, writeStream2))

    const p2 = readStream2.read().then(({closed, data}) => {
      assert.equal(data, 'one')
      readStream2.closeRead(new Error())
    })

    writeStream1.write('one')
    const p3 = assert::rejected(writeStream1.prepareWrite())

    await Promise.all([p1, p2, p3])

    assert.end()
  })

  assert::asyncTest('should read fail', async function(assert) {
    const {
      writeStream: writeStream1,
      readStream: readStream1
    } = createChannel()

    const {
      writeStream: writeStream2,
      readStream: readStream2
    } = createChannel()

    const p1 = assert::rejected(pipeStream(readStream1, writeStream2))

    writeStream1.write('one')
    writeStream1.closeWrite(new Error())

    const p2 = readStream2.read().then(({closed, data}) => {
      assert.equal(data, 'one')

      return assert::rejected(readStream2.read())
    })

    await Promise.all([p1, p2])
    assert.end()
  })
})
