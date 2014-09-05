"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__fs__,
    $___46__46__47_lib_47_stream_45_util_46_js__,
    $__quiver_45_promise__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var $__3 = fs,
    readFileSync = $__3.readFileSync,
    createReadStream = $__3.createReadStream,
    createWriteStream = $__3.createWriteStream;
var $__1 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    nodeToQuiverReadStream = $__1.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__1.nodeToQuiverWriteStream,
    streamToText = $__1.streamToText;
var enableDebug = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).enableDebug;
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
