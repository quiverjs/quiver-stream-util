export const pipeStream = async function(readStream, writeStream) {
  try {
    while(true) {
      const { closed: writeClosed } = await writeStream.prepareWrite()
      if(writeClosed) return readStream.closeRead()

      const { data, closed: readClosed } = await readStream.read()
      if(readClosed) return writeStream.closeWrite()

      writeStream.write(data)
    }
  } catch(err) {
    readStream.closeRead(err)
    writeStream.closeWrite(err)

    throw err
  }
}
