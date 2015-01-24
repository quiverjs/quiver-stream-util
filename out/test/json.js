"use strict";
var $__traceur_64_0_46_0_46_8__,
    $___46__46__47_lib_47_stream_45_util__,
    $__quiver_45_promise__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var $__0 = ($___46__46__47_lib_47_stream_45_util__ = require("../lib/stream-util"), $___46__46__47_lib_47_stream_45_util__ && $___46__46__47_lib_47_stream_45_util__.__esModule && $___46__46__47_lib_47_stream_45_util__ || {default: $___46__46__47_lib_47_stream_45_util__}),
    streamToJson = $__0.streamToJson,
    buffersToStream = $__0.buffersToStream,
    textToStreamable = $__0.textToStreamable,
    jsonToStreamable = $__0.jsonToStreamable,
    streamableToJson = $__0.streamableToJson;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
let chai = require('chai');
let should = chai.should();
let originalJson = {
  "foo": "testing 123",
  "bar": ["a", "b"]
};
let testJson = function(json) {
  json.foo.should.equal('testing 123');
  json.bar[0].should.equal('a');
  json.bar[1].should.equal('b');
};
let testBuffers = ['{ "fo', 'o": "', 'testing ', '123", ', '"bar', '": [ ', '"a", "b', '"] }'];
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
  it('should convert json to streamable', async(function*() {
    let streamable = jsonToStreamable(originalJson);
    should.exist(streamable.toJson);
    should.exist(streamable.toText);
    should.exist(streamable.toBuffer);
    streamable.contentType.should.equal('application/json');
    yield streamable.toJson().then(testJson);
    yield streamable.toText().then(JSON.parse).then(testJson);
    yield streamable.toStream().then(streamToJson).then(testJson);
  }));
  it('should convert text to streamble', async(function*() {
    let jsonText = JSON.stringify(originalJson);
    let streamable = textToStreamable(jsonText);
    should.not.exist(streamable.toJson);
    should.exist(streamable.toText);
    yield streamableToJson(streamable).then(testJson);
    should.exist(streamable.toJson);
  }));
});
