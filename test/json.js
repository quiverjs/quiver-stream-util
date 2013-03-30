
var jsonConvert = require('../lib/json')
var textConvert = require('../lib/text')
var path = require('path')
var fileStream = require('quiver-file-stream')
var should = require('should')

var testFile = './test-file.json'
var testPath = path.join(__dirname, testFile)
var originalJson = require(testFile)

var testEqualOriginalJson = function(json) {
  json.foo.should.equal('testing 123')
  json.bar[0].should.equal('a')
  json.bar[1].should.equal('b')
}

var testStream = function(readStream, callback) {
  jsonConvert.streamToJson(readStream, function(err, json) {
    if(err) throw err

    testEqualOriginalJson(json)
    callback(null)
  })
}

describe('basic json test', function() {
  it('sanity test with original content', function() {
    testEqualOriginalJson(originalJson)
  })

  it('should parse json correctly', function(callback) {
    fileStream.createFileReadStream(testPath, function(err, readStream) {
      if(err) throw err

      testStream(readStream, callback)
    })
  })

  it('should convert json to streamable', function(callback) {
    var streamable = jsonConvert.jsonToStreamable(originalJson)
    testStream(streamable.toStream(), callback)
  })

  it('should convert text to streamble', function(callback) {
    var jsonText = JSON.stringify(originalJson)
    var streamable = textConvert.textToStreamable(jsonText)
    jsonConvert.streamableToJson(streamable, function(err, json) {
      if(err) throw err

      testEqualOriginalJson(json)
      callback(null)
    })
  })
})
