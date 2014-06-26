"use strict";
Object.defineProperties(exports, {
  streamToJson: {get: function() {
      return streamToJson;
    }},
  streamableToJson: {get: function() {
      return streamableToJson;
    }},
  jsonToStream: {get: function() {
      return jsonToStream;
    }},
  jsonToStreamable: {get: function() {
      return jsonToStreamable;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('./text.js')),
    streamToText = $__0.streamToText,
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var $__0 = $traceurRuntime.assertObject(JSON),
    parseJson = $__0.parse,
    stringify = $__0.stringify;
var streamToJson = (function(readStream) {
  return streamToText(readStream).then(parseJson);
});
var streamableToJson = (function(streamable) {
  if (streamable.toJson)
    return resolve(streamable.toJson());
  return streamableToText(streamable).then(parseJson).then((function(json) {
    if (streamable.reusable && !streamable.toJson) {
      streamable.toJson = (function() {
        return resolve(copy(json));
      });
    }
    return json;
  }));
});
var jsonToStream = (function(json) {
  return textToStream(stringify(json));
});
var jsonToStreamable = (function(json) {
  var streamable = textToStreamable(stringify(json));
  streamable.contentType = 'application/json';
  return streamable;
});
