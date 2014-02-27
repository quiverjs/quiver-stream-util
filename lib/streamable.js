'use strict'

var buffersConvert = require('./buffers')
var error = require('quiver-error').error
var streamChannel = require('quiver-stream-channel')

var streamToStreamable = function(readStream) {
  var streamable = { }

  streamable.reusable = false
  var streamOpened = false

  streamable.toStream = function(callback) {
    if(streamOpened) return callback(error(500, 'this streamable can only be opened once'))

    streamOpened = true
    callback(null, readStream)
  }

  return streamable
}

var streamToReusableStreamable = function(readStream) {
  var streamable = { }
  readStream.acquireOwnership(streamable)

  var mBuffers = [ ]
  var mStreamClosed = null

  var mPendingWriteStreams = [ ]

  var onReadClosed = function(streamClosed) {
    mStreamClosed = streamClosed

    mPendingWriteStreams.forEach(function(writeStream) {
      writeStream.closeWrite(streamClosed.err)
    })

    mPendingWriteStreams = null
  }

  var onData = function(data) {
    mBuffers.push(data)
    mPendingWriteStreams.forEach(function(writeStream) {
      writeStream.write(data)
    })
  }

  var doPipe = function() {
    readStream.read(function(streamClosed, data) {
      if(streamClosed) {
        onReadClosed(streamClosed)
      } else {
        onData(data)
        doPipe()
      }
    })
  }

  doPipe()

  streamable.toStream = function(callback) {
    if(mStreamClosed) return callback(null, buffersConvert.buffersToStream(mBuffers, mStreamClosed.err))

    var channel = streamChannel.createStreamChannel()
    var writeStream = channel.writeStream

    mBuffers.forEach(function(buffer) {
      writeStream.write(buffer)
    })
    mPendingWriteStreams.push(writeStream)

    callback(null, channel.readStream)
  }

  return streamable
}

var createReusableStreamable = function(streamable, callback) {
  if(streamable.reusable) return callback(null, streamable)

  streamable.toStream(function(err, readStream) {
    if(err) return callback(err)

    callback(null, streamToReusableStreamable(readStream))
  })
}

module.exports = {
  streamToStreamable: streamToStreamable,
  streamToReusableStreamable: streamToReusableStreamable,
  createReusableStreamable: createReusableStreamable
}