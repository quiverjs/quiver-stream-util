import { streamToText, streamableToText } from './text.js'
import { copy } from 'quiver-object'

var { parse: parseJson, stringify } = JSON

export var streamToJson = readStream =>
  streamToText(readStream).then(parseJson)

export var streamableToJson = streamable => {
  if(streamable.toJson) return resolve(streamable.toJson())

  return streamableToText(streamable).then(parseJson)
  .then(json => {
    if(streamable.reusable && !streamable.toJson) {
      streamable.toJson = () => resolve(copy(json))
    }

    return json
  })
}

export var jsonToStream = json => 
  textToStream(stringify(json))

export var jsonToStreamable = json => {
  var streamable = textToStreamable(stringify(json))
  streamable.contentType = 'application/json'

  return streamable
}