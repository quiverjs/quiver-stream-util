"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/stream-util.js')),
    streamableToText = $__0.streamableToText,
    buffersToStreamable = $__0.buffersToStreamable,
    reuseStream = $__0.reuseStream,
    streamToBuffers = $__0.streamToBuffers;
var chai = require('chai');
var should = chai.should();
var testBuffers = ['foo', 'bar', 'baz'];
describe('basic buffer test', (function() {
  var streamable = buffersToStreamable(testBuffers);
  it('should convert buffers to stream', (function() {
    return streamable.toStream().then((function(readStream) {
      return readStream.read().then((function($__0) {
        var closed = $__0.closed,
            data = $__0.data;
        data.should.equal(testBuffers[0]);
        return readStream.read().then((function($__1) {
          var closed = $__1.closed,
              data = $__1.data;
          data.should.equal(testBuffers[1]);
          return readStream.read().then((function($__2) {
            var closed = $__2.closed,
                data = $__2.data;
            data.should.equal(testBuffers[2]);
            return readStream.read().then((function($__3) {
              var closed = $__3.closed,
                  data = $__3.data;
              return should.exist(closed);
            }));
          }));
        }));
      }));
    }));
  }));
  it('should be convertible to string', (function() {
    return streamableToText(streamable).then((function(text) {
      return text.should.equal('foobarbaz');
    }));
  }));
  it('convert buffers stream into reusable streamable', (function() {
    return streamable.toStream().then(reuseStream).then((function(streamable) {
      return streamable.toStream().then(streamToBuffers).then((function(buffers) {
        buffers.should.eql(testBuffers);
        return streamable.toStream().then(streamToBuffers).then((function(buffers) {
          return buffers.should.eql(testBuffers);
        }));
      }));
    }));
  }));
}));
