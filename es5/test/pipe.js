"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/stream-util.js')),
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
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        writeStream = $__0.writeStream,
        readStream = $__0.readStream;
    var p1 = pipeStream(sourceStream, writeStream);
    var p2 = streamToText(readStream).then((function(text) {
      return text.should.equal('one two three');
    }));
    return Promise.all([p1, p2]);
  }));
  it('should write fail', (function() {
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        writeStream1 = $__0.writeStream,
        readStream1 = $__0.readStream;
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        writeStream2 = $__0.writeStream,
        readStream2 = $__0.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    var p2 = readStream2.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
      data.should.equal('one');
      readStream2.closeRead(new Error());
    }));
    writeStream1.write('one');
    var p3 = writeStream1.prepareWrite().should.be.rejected;
    return Promise.all([p1, p2, p3]);
  }));
  it('should read fail', (function() {
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        writeStream1 = $__0.writeStream,
        readStream1 = $__0.readStream;
    var $__0 = $traceurRuntime.assertObject(createChannel()),
        writeStream2 = $__0.writeStream,
        readStream2 = $__0.readStream;
    var p1 = pipeStream(readStream1, writeStream2).should.be.rejected;
    writeStream1.write('one');
    writeStream1.closeWrite(new Error());
    var p2 = readStream2.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
      data.should.equal('one');
      return readStream2.read().should.be.rejected;
    }));
    return Promise.all([p1, p2]);
  }));
}));
