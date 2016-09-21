import { pipeStream } from './pipe'
import { nodeToQuiverWriteStream } from './node-stream'

export const pipeStreamableToNodeStream = async (streamable, nodeWrite) => {
  if(streamable.toNodeStream) {
    const nodeRead = await streamable.toNodeStream()
    nodeRead.pipe(nodeWrite)
    await new Promise((resolve, reject) => {
      nodeWrite.on('close', resolve)
      nodeWrite.on('error', reject)
    })

  } else {
    const readStream = await streamable.toStream()
    const writeStream = nodeToQuiverWriteStream(nodeWrite)

    await pipeStream(readStream, writeStream)
  }
}
