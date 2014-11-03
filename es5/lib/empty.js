"use strict";
Object.defineProperties(exports, {
  emptyReadStream: {get: function() {
      return emptyReadStream;
    }},
  emptyWriteStream: {get: function() {
      return emptyWriteStream;
    }},
  emptyStreamable: {get: function() {
      return emptyStreamable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var emptyReadStream = (function() {
  return ({
    read: (function() {
      return resolve({closed: true});
    }),
    closeRead: (function(err) {}),
    isClosed: (function() {
      return ({});
    })
  });
});
var emptyWriteStream = (function(closeErr) {
  return ({
    prepareWrite: (function() {
      return resolve({closed: true});
    }),
    write: (function(data) {}),
    closeWrite: (function(err) {}),
    isClosed: (function() {
      return ({});
    })
  });
});
var emptyStreamable = (function(closeErr) {
  return ({
    reusable: true,
    contentLength: 0,
    toStream: (function() {
      return resolve(emptyReadStream(closeErr));
    }),
    toText: (function() {
      return resolve('');
    }),
    toBuffer: (function() {
      return resolve(new Buffer(0));
    })
  });
});
