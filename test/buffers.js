
var streamConvert = require('../lib/stream-convert')
var should = require('should')

var testBuffers = [ 'foo', 'bar', 'baz' ]

describe('basic buffer test', function() {
  var streamable = streamConvert.buffersToStreamable(testBuffers)

  it('should convert buffers to stream', function(callback) {
    streamable.toStream(function(err, readStream) {
      if(err) throw err

      readStream.read(function(streamClosed, data) {
        data.should.equal(testBuffers[0])

        readStream.read(function(streamClosed, data) {
          data.should.equal(testBuffers[1])

          readStream.read(function(streamClosed, data) {
            data.should.equal(testBuffers[2])

            readStream.read(function(streamClosed, data) {
              should.exist(streamClosed)

              callback(null)
            })
          })
        })
      })
    })
  })

  it('should be convertible to string', function(callback) {
    streamConvert.streamableToText(streamable, function(err, text) {
      if(err) throw err

      text.should.equal('foobarbaz')
      callback(null)
    })
  })

  it('convert buffers stream into reusable streamable', function(callback) {
    streamable.toStream(function(err, readStream) {
      if(err) throw err

      var reusable = streamConvert.streamToReusableStreamable(readStream)
      
      reusable.toStream(function(err, readStream) {
        if(err) throw err

        streamConvert.streamToBuffers(readStream, function(err, buffers) {
          should.not.exist(err)
          buffers.should.eql(testBuffers)

          reusable.toStream(function(err, readStream) {
            if(err) throw err

            streamConvert.streamToBuffers(readStream, function(err, buffers) {
              should.not.exist(err)
              buffers.should.eql(testBuffers)

              callback(null)
            })
          })
        })
      })
    })
  })
})