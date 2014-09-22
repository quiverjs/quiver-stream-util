import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { resolve } from 'quiver-promise'
import { 
  streamToText, streamableToText, 
  toTextToStreamable 
} from './text.js'

var { parse: parseJson, stringify } = JSON

export var streamToJson = readStream =>
  streamToText(readStream).then(text => {
    try {
      var json = parseJson(text)
    } catch(err) {
      throw error(400, 'error parsing json stream: ' + err)
    }

    return json
  })

export var streamableToJson = streamable => {
  if(streamable.toJson) return resolve(streamable.toJson())

  return streamableToText(streamable).then(parseJson)
  .then(json => {
    if(streamable.reusable && !streamable.toJson) {
      streamable.toJson = () => resolve(copy(json))
    }

    return copy(json)
  })
}

export var jsonToStream = json => 
  textToStream(stringify(json))

export var jsonToStreamable = json => {
  var text = null

  var toText = () => {
    if(!text) text = stringify(json)

    return text
  }

  var streamable = toTextToStreamable(toText, 'application/json')
  streamable.toJson = () =>
    resolve(copy(json))

  return streamable
}