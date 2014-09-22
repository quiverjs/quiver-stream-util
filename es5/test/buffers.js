"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_stream_45_util_46_js__,
    $__quiver_45_promise__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var $__0 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    streamableToText = $__0.streamableToText,
    buffersToStreamable = $__0.buffersToStreamable,
    reuseStream = $__0.reuseStream,
    streamToBuffers = $__0.streamToBuffers;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    enableDebug = $__1.enableDebug,
    promiseChain = $__1.promiseChain,
    resolve = $__1.resolve;
enableDebug({timeout: 1000});
var chai = require('chai');
var should = chai.should();
var testBuffers = ['foo', 'bar', 'baz'];
describe('basic buffer test', (function() {
  var streamable = buffersToStreamable(testBuffers);
  it('should convert buffers to stream', (function() {
    return promiseChain((function(complete) {
      return streamable.toStream().then((function(readStream) {
        return readStream.read().then((function($__2) {
          var $__3 = $__2,
              closed = $__3.closed,
              data = $__3.data;
          data.should.equal(testBuffers[0]);
          return readStream.read().then((function($__4) {
            var $__5 = $__4,
                closed = $__5.closed,
                data = $__5.data;
            data.should.equal(testBuffers[1]);
            return readStream.read().then((function($__6) {
              var $__7 = $__6,
                  closed = $__7.closed,
                  data = $__7.data;
              data.should.equal(testBuffers[2]);
              return readStream.read().then((function($__8) {
                var $__9 = $__8,
                    closed = $__9.closed,
                    data = $__9.data;
                should.exist(closed);
                return complete;
              }));
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
