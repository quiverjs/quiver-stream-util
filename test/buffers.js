
var buffersConvert = require('../lib/buffers')
var textConvert = require('../lib/text')
var should = require('should')

var testBuffers = [ 'foo', 'bar', 'baz' ]

describe('basic buffer test', function() {
  var streamable = buffersConvert.buffersToStreamable(testBuffers)

  it('should convert buffers to stream', function(callback) {
    var readStream = streamable.toStream()

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

  it('should be convertible to string', function(callback) {
    textConvert.streamableToText(streamable, function(err, text) {
      if(err) throw err

      text.should.equal('foobarbaz')
      callback(null)
    })
  })
})