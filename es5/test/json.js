"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_stream_45_util_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    streamToJson = $__0.streamToJson,
    buffersToStream = $__0.buffersToStream,
    textToStreamable = $__0.textToStreamable,
    jsonToStreamable = $__0.jsonToStreamable,
    streamableToJson = $__0.streamableToJson;
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
  it('should convert json to streamable', (function() {
    var streamable = jsonToStreamable(originalJson);
    streamable.contentType.should.equal('application/json');
    return streamable.toStream().then(streamToJson).then(testJson);
  }));
  it('should convert text to streamble', (function() {
    var jsonText = JSON.stringify(originalJson);
    var streamable = textToStreamable(jsonText);
    return streamableToJson(streamable).then(testJson);
  }));
});
