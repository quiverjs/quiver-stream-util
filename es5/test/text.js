"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_stream_45_channel__,
    $___46__46__47_lib_47_stream_45_util_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var createChannel = ($__quiver_45_stream_45_channel__ = require("quiver-stream-channel"), $__quiver_45_stream_45_channel__ && $__quiver_45_stream_45_channel__.__esModule && $__quiver_45_stream_45_channel__ || {default: $__quiver_45_stream_45_channel__}).createChannel;
var streamToText = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}).streamToText;
var chai = require('chai');
var should = chai.should();
var testString = '世界你好';
var testBuffer = new Buffer(testString);
var buffer1 = testBuffer.slice(0, 5);
var buffer2 = testBuffer.slice(5, 10);
var buffer3 = testBuffer.slice(10, 12);
describe('unicode text test', function() {
  it('buffer to string then concat should not equal original', (function() {
    var result = '' + buffer1 + '' + buffer2 + '' + buffer3;
    result.should.not.equal(testString);
  }));
  it('buffer concat then to string should equal original', (function() {
    var buffer = Buffer.concat([buffer1, buffer2, buffer3]);
    var result = '' + buffer;
    result.should.equal(testString);
  }));
  it('stream to text should equal original', (function() {
    var $__2 = createChannel(),
        readStream = $__2.readStream,
        writeStream = $__2.writeStream;
    writeStream.write(buffer1);
    writeStream.write(buffer2);
    writeStream.write(buffer3);
    writeStream.closeWrite();
    return streamToText(readStream).then((function(text) {
      return text.should.equal(testString);
    }));
  }));
});
