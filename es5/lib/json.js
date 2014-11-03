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
    $__quiver_45_error__,
    $__quiver_45_promise__,
    $__text__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__3 = ($__text__ = require("./text"), $__text__ && $__text__.__esModule && $__text__ || {default: $__text__}),
    streamToText = $__3.streamToText,
    streamableToText = $__3.streamableToText,
    toTextToStreamable = $__3.toTextToStreamable;
var $__4 = JSON,
    parseJson = $__4.parse,
    stringify = $__4.stringify;
var streamToJson = (function(readStream) {
  return streamToText(readStream).then((function(text) {
    try {
      var json = parseJson(text);
    } catch (err) {
      throw error(400, 'error parsing json stream: ' + err);
    }
    return json;
  }));
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
    return copy(json);
  }));
});
var jsonToStream = (function(json) {
  return textToStream(stringify(json));
});
var jsonToStreamable = (function(json) {
  var text = null;
  var toText = (function() {
    if (!text)
      text = stringify(json);
    return text;
  });
  var streamable = toTextToStreamable(toText, 'application/json');
  streamable.toJson = (function() {
    return resolve(copy(json));
  });
  return streamable;
});
