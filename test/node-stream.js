import 'traceur'
import fs from 'fs'

import { 
  nodeToQuiverReadStream, nodeToQuiverWriteStream, streamToText
} from '../lib/stream-util.js'

var { 
  readFileSync, createReadStream, createWriteStream
} = fs

var sampleFile = 'test/sample.txt'
var tempWrite = 'test/temp.txt'
var expectedContent = readFileSync(sampleFile).toString()

var chunkString = (content, count) => {
  var length = content.length
  var interval = (length / count) | 0
  var chunks = []

  for(var i=0; i<=count; i++) {
    var start = interval*i
    var end = interval*(i+1)

    if(start >= length) break
    if(end > length) end == length

    chunks.push(content.slice(start, end))
  }

  return chunks
}

var writeChunks = chunkString(expectedContent, 5)

describe('node stream convert test', () => {
  it('should read the right content', () => {
    var nodeStream = createReadStream(sampleFile)
    var readStream = nodeToQuiverReadStream(nodeStream)

    return streamToText(readStream, text =>
      text.should.equal(expectedContent))
  })

  it('test write chunks correctness', () => 
    writeChunks.join('').should.equal(expectedContent))

  it('should write the right content', callback => {
    var nodeStream = createWriteStream(tempWrite)
    var writeStream = nodeToQuiverWriteStream(nodeStream)

    writeChunks.forEach(data =>
      writeStream.write(data))

    writeStream.closeWrite()

    nodeStream.on('finish', () => {
      var result = readFileSync(tempWrite).toString()
      result.should.equal(expectedContent)
      callback()
    })
  })
})