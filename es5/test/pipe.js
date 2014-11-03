"use strict";
var $__traceur_64_0_46_0_46_7__,
    $___46__46__47_lib_47_stream_45_util_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    pipeStream = $__0.pipeStream,
    createChannel = $__0.createChannel,
    buffersToStream = $__0.buffersToStream,
    streamToText = $__0.streamToText;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var buffers = ['one ', 'two ', 'three'];
describe('pipestream test', (function() {
  it('should pipe successfully', (function() {
    var sourceStream = buffersToStream(buffers);
    var $__3 = createChannel(),
        writeStream = $__3.writeStream,
        readStream = $__3.readStream;
    var p1 = pipeStream(sourceStream, writeStream);
    var p2 = streamToText(readStream).then((function(text) {
      return text.should.equal('one two three');
    }));
    return Promise.all([p1, p2]);
  }));
  it('should write fail', (function() {
    var $__3 = createChannel(),
        writeStream1 = $__3.writeStream,
        readStream1 = $__3.readStream;
    var $__4 = createChannel(),
        writeStream2 = $__4.writeStream,
        readStream2 = $__4.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    var p2 = readStream2.read().then((function($__5) {
      var $__6 = $__5,
          closed = $__6.closed,
          data = $__6.data;
      data.should.equal('one');
      readStream2.closeRead(new Error());
    }));
    writeStream1.write('one');
    var p3 = writeStream1.prepareWrite().should.be.rejected;
    return Promise.all([p1, p2, p3]);
  }));
  it('should read fail', (function() {
    var $__3 = createChannel(),
        writeStream1 = $__3.writeStream,
        readStream1 = $__3.readStream;
    var $__4 = createChannel(),
        writeStream2 = $__4.writeStream,
        readStream2 = $__4.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    writeStream1.write('one');
    writeStream1.closeWrite(new Error());
    var p2 = readStream2.read().then((function($__5) {
      var $__6 = $__5,
          closed = $__6.closed,
          data = $__6.data;
      data.should.equal('one');
      return readStream2.read().should.be.rejected;
    }));
    return Promise.all([p1, p2]);
  }));
}));
