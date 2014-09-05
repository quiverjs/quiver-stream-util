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
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $__text_46_js__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__2 = ($__text_46_js__ = require("./text.js"), $__text_46_js__ && $__text_46_js__.__esModule && $__text_46_js__ || {default: $__text_46_js__}),
    streamToText = $__2.streamToText,
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable;
var $__3 = JSON,
    parseJson = $__3.parse,
    stringify = $__3.stringify;
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
