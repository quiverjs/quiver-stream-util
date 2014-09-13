"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_stream_45_util_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($___46__46__47_lib_47_stream_45_util_46_js__ = require("../lib/stream-util.js"), $___46__46__47_lib_47_stream_45_util_46_js__ && $___46__46__47_lib_47_stream_45_util_46_js__.__esModule && $___46__46__47_lib_47_stream_45_util_46_js__ || {default: $___46__46__47_lib_47_stream_45_util_46_js__}),
    streamToText = $__1.streamToText,
    buffersToStream = $__1.buffersToStream,
    pushbackStream = $__1.pushbackStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('stream pushback test', (function() {
  it('should emit pushed back buffers first', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var testBuffers,
        pushbackBuffers,
        readStream,
        data,
        $__6,
        $__7,
        $__8,
        $__9,
        $__10,
        $__11,
        $__12,
        $__13;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['foo ', 'bar'];
            pushbackBuffers = ['before1 ', 'before2 '];
            readStream = buffersToStream(testBuffers);
            readStream = pushbackStream(readStream, pushbackBuffers);
            $ctx.state = 22;
            break;
          case 22:
            $__6 = readStream.peek;
            $__7 = $__6.call(readStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__7;
          case 2:
            $__8 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__9 = $__8.data;
            data = $__9;
            $ctx.state = 8;
            break;
          case 8:
            data.should.equal('before1 ');
            $ctx.state = 24;
            break;
          case 24:
            $__10 = readStream.peek;
            $__11 = $__10.call(readStream);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__11;
          case 10:
            $__12 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__13 = $__12.data;
            data = $__13;
            $ctx.state = 16;
            break;
          case 16:
            data.should.equal('before1 ');
            $ctx.state = 26;
            break;
          case 26:
            $ctx.state = 18;
            return streamToText(readStream).should.eventually.equal('before1 before2 foo bar');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
  it('nested stream pushback test', async($traceurRuntime.initGeneratorFunction(function $__14() {
    var testBuffers,
        readStream;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['six ', 'seven'];
            readStream = buffersToStream(testBuffers);
            readStream = pushbackStream(readStream, ['four ', 'five ']);
            readStream = pushbackStream(readStream, ['three ']);
            readStream = pushbackStream(readStream, ['one ', 'two ']);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToText(readStream).should.eventually.equal('one two three four five six seven');
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__14, this);
  })));
}));
