import { copy } from 'quiver-util/object'
import { error } from 'quiver-util/error'

import { streamOpener } from './util'
import {
  streamToText, textToStream,
  streamableToText, textToStreamable
} from './text'

const parseJson = text => {
  try {
    return JSON.parse(text)
  } catch(err) {
    throw error(400, 'error parsing json stream: ' + err)
  }
}

export const streamToJson = async function(readStream) {
  const text = await streamToText(readStream)
  return parseJson(text)
}

export const streamableToJson = async function(streamable) {
  if(streamable.toJson) return streamable.toJson()

  const text = await streamableToText(streamable)
  const json = parseJson(text)

  if(!streamable.reusable || streamable.toJson)
    return json

  streamable.toJson = async function() {
    return copy(json)
  }

  return copy(json)
}

export const jsonToStream = json =>
  textToStream(JSON.stringify(json))

const validateJsonObject = json => {
  if(typeof(json) !== 'object' && !json.toJSON)
    throw new TypeError('argument must be serializable json object')
}

export const jsonToStreamable = (json, contentType='application/json') => {
  validateJsonObject(json)
  const text = JSON.stringify(json)

  const streamable = textToStreamable(text, contentType)
  streamable.toJson = async function() {
    return copy(json)
  }

  return streamable
}

export const jsonToNonReusableStreamable = (json, contentType='application/json') => {
  const openStream = streamOpener()
  return {
    reusable: false,
    contentType,

    async toJson() {
      openStream()
      return json
    },

    async toStream() {
      openStream()
      return jsonToStream(json)
    }
  }
}
