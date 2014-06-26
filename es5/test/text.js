"use strict";
require('traceur');
var createChannel = $traceurRuntime.assertObject(require('quiver-stream-channel')).createChannel;
var streamToText = $traceurRuntime.assertObject(require('../lib/stream-convert.js')).streamToText;
var should = require('should');
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
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        readStream = $__0.readStream,
        writeStream = $__0.writeStream;
    writeStream.write(buffer1);
    writeStream.write(buffer2);
    writeStream.write(buffer3);
    writeStream.closeWrite();
    return streamToText(readStream).then((function(text) {
      return text.should.equal(testString);
    }));
  }));
});
