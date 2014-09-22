"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_stream_45_util_46_js__,
    $__quiver_45_promise__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var $__0 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    streamToJson = $__0.streamToJson,
    buffersToStream = $__0.buffersToStream,
    textToStreamable = $__0.textToStreamable,
    jsonToStreamable = $__0.jsonToStreamable,
    streamableToJson = $__0.streamableToJson;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var chai = require('chai');
var should = chai.should();
var originalJson = {
  "foo": "testing 123",
  "bar": ["a", "b"]
};
var testJson = function(json) {
  json.foo.should.equal('testing 123');
  json.bar[0].should.equal('a');
  json.bar[1].should.equal('b');
};
var testBuffers = ['{ "fo', 'o": "', 'testing ', '123", ', '"bar', '": [ ', '"a", "b', '"] }'];
describe('basic json test', function() {
  it('sanity test with original content', (function() {
    return testJson(originalJson);
  }));
  it('sanity test with test buffers', (function() {
    return testJson(JSON.parse((testBuffers.join(''))));
  }));
  it('should parse json correctly', (function() {
    return streamToJson(buffersToStream(testBuffers)).then(testJson);
  }));
  it('should convert json to streamable', async($traceurRuntime.initGeneratorFunction(function $__2() {
    var streamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            streamable = jsonToStreamable(originalJson);
            should.exist(streamable.toJson);
            should.exist(streamable.toText);
            should.exist(streamable.toBuffer);
            streamable.contentType.should.equal('application/json');
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return streamable.toJson().then(testJson);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return streamable.toText().then(JSON.parse).then(testJson);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return streamable.toStream().then(streamToJson).then(testJson);
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  })));
  it('should convert text to streamble', async($traceurRuntime.initGeneratorFunction(function $__3() {
    var jsonText,
        streamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            jsonText = JSON.stringify(originalJson);
            streamable = textToStreamable(jsonText);
            should.not.exist(streamable.toJson);
            should.exist(streamable.toText);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamableToJson(streamable).then(testJson);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            should.exist(streamable.toJson);
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  })));
});
