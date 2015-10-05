import { resolve } from 'quiver-util/promise'

export const emptyReadStream = () => ({
  read: () => resolve({ closed: true }),
  closeRead: err => { },
  isClosed: () => ({})
})

export const emptyWriteStream = () => ({
  prepareWrite: () => resolve({ closed: true }),
  write: data => { },
  closeWrite: err => { },
  isClosed: () => ({})
})

export const emptyStreamable = () => ({
  reusable: true,
  contentLength: 0,
  toStream: () => resolve(emptyReadStream()),
  toText: () => resolve(''),
  toBuffer: () => resolve(new Buffer(0))
})
