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
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
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
    })
  });
});
