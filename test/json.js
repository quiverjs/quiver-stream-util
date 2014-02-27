
var streamConvert = require('../lib/stream-convert')
var fs = require('fs')
var path = require('path')
var should = require('should')
var nodeStream = require('quiver-node-stream')
'use strict'

var testFile = './test-file.json'
var testPath = path.join(__dirname, testFile)
var originalJson = require(testFile)

var createFileReadStream = function(filePath) {
  var nodeReadStream = fs.createReadStream(filePath)
  return nodeStream.createNodeReadStreamAdapter(nodeReadStream)
}

var testEqualOriginalJson = function(json) {
  json.foo.should.equal('testing 123')
  json.bar[0].should.equal('a')
  json.bar[1].should.equal('b')
}

var testStream = function(readStream, callback) {
  streamConvert.streamToJson(readStream, function(err, json) {
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
    var nodeReadStream = fs.createReadStream(testPath)
    var readStream = nodeStream.createNodeReadStreamAdapter(nodeReadStream)

    testStream(readStream, callback)
  })

  it('should convert json to streamable', function(callback) {
    var streamable = streamConvert.jsonToStreamable(originalJson)
    streamable.contentType.should.equal('application/json')
    streamable.toStream(function(err, readStream) {
      if(err) throw err

      testStream(readStream, callback)
    })
  })

  it('should convert text to streamble', function(callback) {
    var jsonText = JSON.stringify(originalJson)
    var streamable = streamConvert.textToStreamable(jsonText)
    streamConvert.streamableToJson(streamable, function(err, json) {
      if(err) throw err

      testEqualOriginalJson(json)
      callback(null)
    })
  })
})
