"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($___46__46__47_lib_47_stream_45_util__ = require("../lib/stream-util"), $___46__46__47_lib_47_stream_45_util__ && $___46__46__47_lib_47_stream_45_util__.__esModule && $___46__46__47_lib_47_stream_45_util__ || {default: $___46__46__47_lib_47_stream_45_util__}),
    streamToText = $__1.streamToText,
    buffersToStream = $__1.buffersToStream,
    pushbackStream = $__1.pushbackStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('stream pushback test', (function() {
  it('should emit pushed back buffers first', async(function*() {
    let testBuffers = ['foo ', 'bar'];
    let pushbackBuffers = ['before1 ', 'before2 '];
    let readStream = buffersToStream(testBuffers);
    readStream = pushbackStream(readStream, pushbackBuffers);
    var data = (yield readStream.peek()).data;
    data.should.equal('before1 ');
    var data = (yield readStream.peek()).data;
    data.should.equal('before1 ');
    yield streamToText(readStream).should.eventually.equal('before1 before2 foo bar');
  }));
  it('nested stream pushback test', async(function*() {
    let testBuffers = ['six ', 'seven'];
    let readStream = buffersToStream(testBuffers);
    readStream = pushbackStream(readStream, ['four ', 'five ']);
    readStream = pushbackStream(readStream, ['three ']);
    readStream = pushbackStream(readStream, ['one ', 'two ']);
    yield streamToText(readStream).should.eventually.equal('one two three four five six seven');
  }));
}));
