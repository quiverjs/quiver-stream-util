"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_stream_45_util_46_js__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var $__0 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    pipeStream = $__0.pipeStream,
    createChannel = $__0.createChannel,
    buffersToStream = $__0.buffersToStream,
    streamToText = $__0.streamToText;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var buffers = ['one ', 'two ', 'three'];
describe('pipestream test', (function() {
  it('should pipe successfully', (function() {
    var sourceStream = buffersToStream(buffers);
    var $__1 = createChannel(),
        writeStream = $__1.writeStream,
        readStream = $__1.readStream;
    var p1 = pipeStream(sourceStream, writeStream);
    var p2 = streamToText(readStream).then((function(text) {
      return text.should.equal('one two three');
    }));
    return Promise.all([p1, p2]);
  }));
  it('should write fail', (function() {
    var $__1 = createChannel(),
        writeStream1 = $__1.writeStream,
        readStream1 = $__1.readStream;
    var $__2 = createChannel(),
        writeStream2 = $__2.writeStream,
        readStream2 = $__2.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    var p2 = readStream2.read().then((function($__3) {
      var $__4 = $__3,
          closed = $__4.closed,
          data = $__4.data;
      data.should.equal('one');
      readStream2.closeRead(new Error());
    }));
    writeStream1.write('one');
    var p3 = writeStream1.prepareWrite().should.be.rejected;
    return Promise.all([p1, p2, p3]);
  }));
  it('should read fail', (function() {
    var $__1 = createChannel(),
        writeStream1 = $__1.writeStream,
        readStream1 = $__1.readStream;
    var $__2 = createChannel(),
        writeStream2 = $__2.writeStream,
        readStream2 = $__2.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    writeStream1.write('one');
    writeStream1.closeWrite(new Error());
    var p2 = readStream2.read().then((function($__3) {
      var $__4 = $__3,
          closed = $__4.closed,
          data = $__4.data;
      data.should.equal('one');
      return readStream2.read().should.be.rejected;
    }));
    return Promise.all([p1, p2]);
  }));
}));
