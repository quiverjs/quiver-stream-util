import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import { emptyReadStream, emptyWriteStream } from '../lib'

test('empty stream test', assert => {
  assert::asyncTest('test empty read stream', async function(assert) {
    const readStream = emptyReadStream()

    assert.ok(readStream.isClosed())

    const {closed, data} = await readStream.read()

    assert.ok(closed)
    assert.notOk(data)
    assert.end()
  })

  assert::asyncTest('test empty write stream', async function(assert) {
    const writeStream = emptyWriteStream()

    writeStream.write('ignored data')
    assert.ok(writeStream.isClosed())

    const { closed } = await writeStream.prepareWrite()
    assert.ok(closed)

    assert.end()
  })
})
