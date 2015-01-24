import 'traceur'
import { 
  streamToJson, buffersToStream, textToStreamable,
  jsonToStreamable, streamableToJson
} from '../lib/stream-util'

import { async } from 'quiver-promise'

let chai = require('chai')
let should = chai.should()

let originalJson = {
  "foo": "testing 123",
  "bar": [
    "a", "b"
  ]
}

let testJson = function(json) {
  json.foo.should.equal('testing 123')
  json.bar[0].should.equal('a')
  json.bar[1].should.equal('b')
}

let testBuffers = [
  '{ "fo', 'o": "', 'testing ', '123", ', '"bar', '": [ ',
  '"a", "b', '"] }' 
]

describe('basic json test', function() {
  it('sanity test with original content', () => 
    testJson(originalJson))

  it('sanity test with test buffers', () =>
    testJson(JSON.parse((testBuffers.join('')))))

  it('should parse json correctly', () =>
    streamToJson(buffersToStream(testBuffers)).then(testJson))

  it('should convert json to streamable', async(function*() {
    let streamable = jsonToStreamable(originalJson)

    should.exist(streamable.toJson)
    should.exist(streamable.toText)
    should.exist(streamable.toBuffer)

    streamable.contentType.should.equal('application/json')

    yield streamable.toJson()
      .then(testJson)

    yield streamable.toText()
      .then(JSON.parse).then(testJson)

    yield streamable.toStream()
      .then(streamToJson).then(testJson)

  }))

  it('should convert text to streamble', async(function*() {
    let jsonText = JSON.stringify(originalJson)
    let streamable = textToStreamable(jsonText)

    should.not.exist(streamable.toJson)
    should.exist(streamable.toText)

    yield streamableToJson(streamable).then(testJson)

    should.exist(streamable.toJson)
  }))
})
