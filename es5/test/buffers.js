"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__chai__,
    $___46__46__47_lib_47_stream_45_util__,
    $__quiver_45_promise__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var $__1 = ($___46__46__47_lib_47_stream_45_util__ = require("../lib/stream-util"), $___46__46__47_lib_47_stream_45_util__ && $___46__46__47_lib_47_stream_45_util__.__esModule && $___46__46__47_lib_47_stream_45_util__ || {default: $___46__46__47_lib_47_stream_45_util__}),
    streamableToText = $__1.streamableToText,
    buffersToStreamable = $__1.buffersToStreamable,
    reuseStream = $__1.reuseStream,
    streamToBuffers = $__1.streamToBuffers;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    promiseChain = $__2.promiseChain,
    resolve = $__2.resolve;
var should = chai.should();
var testBuffers = ['foo', 'bar', 'baz'];
describe('basic buffer test', (function() {
  var streamable = buffersToStreamable(testBuffers);
  it('should convert buffers to stream', (function() {
    return streamable.toStream().then((function(readStream) {
      return readStream.read().then((function($__3) {
        var $__4 = $__3,
            closed = $__4.closed,
            data = $__4.data;
        data.should.equal(testBuffers[0]);
        return readStream.read().then((function($__5) {
          var $__6 = $__5,
              closed = $__6.closed,
              data = $__6.data;
          data.should.equal(testBuffers[1]);
          return readStream.read().then((function($__7) {
            var $__8 = $__7,
                closed = $__8.closed,
                data = $__8.data;
            data.should.equal(testBuffers[2]);
            return readStream.read().then((function($__9) {
              var $__10 = $__9,
                  closed = $__10.closed,
                  data = $__10.data;
              should.exist(closed);
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
