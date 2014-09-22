import 'traceur'
import { 
  streamToJson, buffersToStream, textToStreamable,
  jsonToStreamable, streamableToJson
} from '../lib/stream-util.js'

import { async } from 'quiver-promise'

var chai = require('chai')
var should = chai.should()

var originalJson = {
  "foo": "testing 123",
  "bar": [
    "a", "b"
  ]
}

var testJson = function(json) {
  json.foo.should.equal('testing 123')
  json.bar[0].should.equal('a')
  json.bar[1].should.equal('b')
}

var testBuffers = [
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
    var streamable = jsonToStreamable(originalJson)

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
    var jsonText = JSON.stringify(originalJson)
    var streamable = textToStreamable(jsonText)

    should.not.exist(streamable.toJson)
    should.exist(streamable.toText)

    yield streamableToJson(streamable).then(testJson)

    should.exist(streamable.toJson)
  }))
})
