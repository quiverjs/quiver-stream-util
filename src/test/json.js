import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  streamToJson, buffersToStream, textToStreamable,
  jsonToStreamable, streamableToJson
} from '../lib'

const originalJson = {
  "foo": "testing 123",
  "bar": [
    "a", "b"
  ]
}

const testJson = function(json) {
  const assert = this
  assert.equal(json.foo, 'testing 123')
  assert.equal(json.bar[0], 'a')
  assert.equal(json.bar[1], 'b')
}

const testBuffers = [
  '{ "fo', 'o": "', 'testing ', '123", ', '"bar', '": [ ',
  '"a", "b', '"] }'
]

test('basic json test', assert => {
  assert.test('sanity test with original content', assert => {
    assert::testJson(originalJson)
    assert.end()
  })

  assert.test('sanity test with test buffers', assert => {
    assert::testJson(JSON.parse((testBuffers.join(''))))
    assert.end()
  })

  assert::asyncTest('should parse json correctly', async function(assert) {
    const json = await streamToJson(buffersToStream(testBuffers))
    assert::testJson(json)
    assert.end()
  })

  assert::asyncTest('should convert json to streamable', async function(assert) {
    const streamable = jsonToStreamable(originalJson)

    assert.ok(streamable.toJson)
    assert.ok(streamable.toText)
    assert.ok(streamable.toBuffer)

    assert.equal(streamable.contentType, 'application/json')

    assert::testJson(await streamable.toJson())

    assert::testJson(JSON.parse(await streamable.toText()))

    assert::testJson(await streamToJson(await streamable.toStream()))

    assert.end()
  })

  assert::asyncTest('should convert text to streamble', async function(assert) {
    const jsonText = JSON.stringify(originalJson)
    const streamable = textToStreamable(jsonText)

    assert.notOk(streamable.toJson)
    assert.ok(streamable.toText)

    assert::testJson(await streamableToJson(streamable))

    assert.ok(streamable.toJson)
    assert.end()
  })
})
