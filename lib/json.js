import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { resolve } from 'quiver-promise'
import { 
  streamToText, streamableToText, 
  toTextToStreamable 
} from './text'

let { parse: parseJson, stringify } = JSON

export let streamToJson = readStream =>
  streamToText(readStream).then(text => {
    try {
      return parseJson(text)
    } catch(err) {
      throw error(400, 'error parsing json stream: ' + err)
    }
  })

export let streamableToJson = streamable => {
  if(streamable.toJson) return resolve(streamable.toJson())

  return streamableToText(streamable).then(parseJson)
  .then(json => {
    if(streamable.reusable && !streamable.toJson) {
      streamable.toJson = () => resolve(copy(json))
    }

    return copy(json)
  })
}

export let jsonToStream = json => 
  textToStream(stringify(json))

export let jsonToStreamable = json => {
  let text = null

  let toText = () => {
    if(!text) text = stringify(json)

    return text
  }

  let streamable = toTextToStreamable(toText, 'application/json')
  streamable.toJson = () =>
    resolve(copy(json))

  return streamable
}