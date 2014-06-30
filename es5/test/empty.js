"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/empty.js')),
    emptyReadStream = $__0.emptyReadStream,
    emptyWriteStream = $__0.emptyWriteStream;
var should = require('should');
describe('empty stream test', (function() {
  it('test empty read stream', (function() {
    var readStream = emptyReadStream();
    should.exist(readStream.isClosed());
    return readStream.read().then((function($__0) {
      var closed = $__0.closed,
          data = $__0.data;
      should.exist(closed);
      should.not.exist(data);
    }));
  }));
  it('test empty write stream', (function() {
    var writeStream = emptyWriteStream();
    writeStream.write('ignored data');
    should.exist(writeStream.isClosed());
    return writeStream.prepareWrite().then((function($__0) {
      var closed = $__0.closed;
      should.exist(closed);
    }));
  }));
}));
