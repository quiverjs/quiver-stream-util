"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('fs')),
    readFileSync = $__0.readFileSync,
    createReadStream = $__0.createReadStream,
    createWriteStream = $__0.createWriteStream;
var $__0 = $traceurRuntime.assertObject(require('../lib/stream-util.js')),
    nodeToQuiverReadStream = $__0.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__0.nodeToQuiverWriteStream,
    streamToText = $__0.streamToText;
var enableDebug = $traceurRuntime.assertObject(require('quiver-promise')).enableDebug;
enableDebug({timeout: 1000});
var sampleFile = 'test/sample.txt';
var tempWrite = 'test/temp.txt';
var expectedContent = readFileSync(sampleFile).toString();
var chunkString = (function(content, count) {
  var length = content.length;
  var interval = (length / count) | 0;
  var chunks = [];
  for (var i = 0; i <= count; i++) {
    var start = interval * i;
    var end = interval * (i + 1);
    if (start >= length)
      break;
    if (end > length)
      end == length;
    chunks.push(content.slice(start, end));
  }
  return chunks;
});
var writeChunks = chunkString(expectedContent, 5);
describe('node stream convert test', (function() {
  it('should read the right content', (function() {
    var nodeStream = createReadStream(sampleFile);
    var readStream = nodeToQuiverReadStream(nodeStream);
    return streamToText(readStream, (function(text) {
      return text.should.equal(expectedContent);
    }));
  }));
  it('test write chunks correctness', (function() {
    return writeChunks.join('').should.equal(expectedContent);
  }));
  it('should write the right content', (function(callback) {
    var nodeStream = createWriteStream(tempWrite);
    var writeStream = nodeToQuiverWriteStream(nodeStream);
    writeChunks.forEach((function(data) {
      return writeStream.write(data);
    }));
    writeStream.closeWrite();
    nodeStream.on('finish', (function() {
      var result = readFileSync(tempWrite).toString();
      result.should.equal(expectedContent);
      callback();
    }));
  }));
}));
