'use strict'

var streamConvert = require('../lib/stream-convert')
var should = require('should')

var testTransform = function(data, callback) {
  var transformedData = '<' + data + '>'
  callback(null, transformedData)
}

var testTransformer = streamConvert.createStreamTransformer('Mock', testTransform)

var testBuffers = ['foo', 'bar', 'baz']
var expectedTransformedBuffers = ['<foo>', '<bar>', '<baz>']
var expectedTransformedString = '<foo><bar><baz>'

var assertTransformedStreamContent = function(readStream, callback) {
  streamConvert.streamToText(readStream, function(err, text) {
    if(err) throw err

    text.should.equal(expectedTransformedString)
    callback()
  })
}

describe('stream transform test', function() {
  it('should transform stream correctly', function(callback) {
    var readStream = streamConvert.buffersToStream(testBuffers)

    testTransformer.streamToMockStream(readStream, function(err, transformedStream) {
      if(err) throw err

      assertTransformedStreamContent(transformedStream, callback)
    })
  })

  it('should have cached streamable transform', function(callback) {
    var streamable = streamConvert.buffersToStreamable(testBuffers)

    should.not.exist(streamable.toMockStream)
    testTransformer.streamableToMockStream(streamable, function(err, transformedStream) {
      if(err) throw err

      should.exist(streamable.toMockStream)

      assertTransformedStreamContent(transformedStream, function() {
        streamable.toMockStream(function(err, newTransformedStream) {
          if(err) throw err

          assertTransformedStreamContent(newTransformedStream, callback)
        })
      })
    })
  })
})