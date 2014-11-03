import { resolve } from 'quiver-promise'

export var emptyReadStream = () => ({
  read: () => resolve({closed: true}),
  closeRead: err => { },
  isClosed: () => ({})
})

export var emptyWriteStream = closeErr => ({
  prepareWrite: () => resolve({closed: true}),
  write: data => { },
  closeWrite: err => { },
  isClosed: () => ({})
})

export var emptyStreamable = closeErr => ({
  reusable: true,
  contentLength: 0,
  toStream: () => resolve(emptyReadStream(closeErr)),
  toText: () => resolve(''),
  toBuffer: () => resolve(new Buffer(0))
})