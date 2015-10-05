import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { awaitEvent } from 'quiver-util/promise'
import {
  readFileSync, createReadStream, createWriteStream
} from 'fs'

import {
  nodeToQuiverReadStream, nodeToQuiverWriteStream, streamToText
} from '../lib'

const sampleFile = 'fixture/sample.txt'
const tempWrite = 'fixture/temp.txt'
const expectedContent = readFileSync(sampleFile).toString()

const chunkString = (content, count) => {
  const length = content.length
  const interval = (length / count) | 0
  const chunks = []

  for(let i=0; i<=count; i++) {
    const start = interval*i
    const end = interval*(i+1)

    if(start >= length) break
    if(end > length) end == length

    chunks.push(content.slice(start, end))
  }

  return chunks
}

const writeChunks = chunkString(expectedContent, 5)

test('node stream convert test', assert => {
  assert::asyncTest('should read the right content', async function(assert) {
    const nodeStream = createReadStream(sampleFile)
    const readStream = nodeToQuiverReadStream(nodeStream)

    const text = await streamToText(readStream)
    assert.equal(text, expectedContent)
    assert.end()
  })

  assert.test('test write chunks correctness', assert => {
    assert.equal(writeChunks.join(''), expectedContent)
    assert.end()
  })

  assert::asyncTest('should write the right content', async function(assert) {
    const nodeStream = createWriteStream(tempWrite)
    const writeStream = nodeToQuiverWriteStream(nodeStream)

    for(let data of writeChunks)
      writeStream.write(data)

    writeStream.closeWrite()

    await awaitEvent(nodeStream, 'finish')

    const result = readFileSync(tempWrite).toString()
    assert.equal(result, expectedContent)

    assert.end()
  })
})
