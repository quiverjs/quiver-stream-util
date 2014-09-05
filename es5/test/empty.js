"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_empty_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_empty_46_js__ = require("../lib/empty.js"), $___46__46__47_lib_47_empty_46_js__ && $___46__46__47_lib_47_empty_46_js__.__esModule && $___46__46__47_lib_47_empty_46_js__ || {default: $___46__46__47_lib_47_empty_46_js__}),
    emptyReadStream = $__0.emptyReadStream,
    emptyWriteStream = $__0.emptyWriteStream;
var should = require('should');
describe('empty stream test', (function() {
  it('test empty read stream', (function() {
    var readStream = emptyReadStream();
    should.exist(readStream.isClosed());
    return readStream.read().then((function($__1) {
      var $__2 = $__1,
          closed = $__2.closed,
          data = $__2.data;
      should.exist(closed);
      should.not.exist(data);
    }));
  }));
  it('test empty write stream', (function() {
    var writeStream = emptyWriteStream();
    writeStream.write('ignored data');
    should.exist(writeStream.isClosed());
    return writeStream.prepareWrite().then((function($__1) {
      var closed = $__1.closed;
      should.exist(closed);
    }));
  }));
}));
