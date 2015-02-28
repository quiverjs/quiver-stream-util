import 'traceur'
import fs from 'fs'

import { 
  nodeToQuiverReadStream, nodeToQuiverWriteStream, streamToText
} from '../lib/stream-util.js'

let { 
  readFileSync, createReadStream, createWriteStream
} = fs

let sampleFile = 'fixture/sample.txt'
let tempWrite = 'fixture/temp.txt'
let expectedContent = readFileSync(sampleFile).toString()

let chunkString = (content, count) => {
  let length = content.length
  let interval = (length / count) | 0
  let chunks = []

  for(let i=0; i<=count; i++) {
    let start = interval*i
    let end = interval*(i+1)

    if(start >= length) break
    if(end > length) end == length

    chunks.push(content.slice(start, end))
  }

  return chunks
}

let writeChunks = chunkString(expectedContent, 5)

describe('node stream convert test', () => {
  it('should read the right content', () => {
    let nodeStream = createReadStream(sampleFile)
    let readStream = nodeToQuiverReadStream(nodeStream)

    return streamToText(readStream, text =>
      text.should.equal(expectedContent))
  })

  it('test write chunks correctness', () => 
    writeChunks.join('').should.equal(expectedContent))

  it('should write the right content', callback => {
    let nodeStream = createWriteStream(tempWrite)
    let writeStream = nodeToQuiverWriteStream(nodeStream)

    writeChunks.forEach(data =>
      writeStream.write(data))

    writeStream.closeWrite()

    nodeStream.on('finish', () => {
      let result = readFileSync(tempWrite).toString()
      result.should.equal(expectedContent)
      callback()
    })
  })
})