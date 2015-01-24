"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__chai__,
    $___46__46__47_lib_47_empty__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var $__1 = ($___46__46__47_lib_47_empty__ = require("../lib/empty"), $___46__46__47_lib_47_empty__ && $___46__46__47_lib_47_empty__.__esModule && $___46__46__47_lib_47_empty__ || {default: $___46__46__47_lib_47_empty__}),
    emptyReadStream = $__1.emptyReadStream,
    emptyWriteStream = $__1.emptyWriteStream;
let should = chai.should();
describe('empty stream test', (function() {
  it('test empty read stream', (function() {
    let readStream = emptyReadStream();
    should.exist(readStream.isClosed());
    return readStream.read().then((function($__2) {
      var $__3 = $__2,
          closed = $__3.closed,
          data = $__3.data;
      should.exist(closed);
      should.not.exist(data);
    }));
  }));
  it('test empty write stream', (function() {
    let writeStream = emptyWriteStream();
    writeStream.write('ignored data');
    should.exist(writeStream.isClosed());
    return writeStream.prepareWrite().then((function($__2) {
      var closed = $__2.closed;
      should.exist(closed);
    }));
  }));
}));
