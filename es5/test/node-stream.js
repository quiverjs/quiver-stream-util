"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__fs__,
    $___46__46__47_lib_47_stream_45_util_46_js__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var $__1 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    nodeToQuiverReadStream = $__1.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__1.nodeToQuiverWriteStream,
    streamToText = $__1.streamToText;
var $__2 = fs,
    readFileSync = $__2.readFileSync,
    createReadStream = $__2.createReadStream,
    createWriteStream = $__2.createWriteStream;
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
