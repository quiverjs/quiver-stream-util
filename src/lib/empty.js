import { resolve } from 'quiver-promise'

export let emptyReadStream = () => ({
  read: () => resolve({closed: true}),
  closeRead: err => { },
  isClosed: () => ({})
})

export let emptyWriteStream = closeErr => ({
  prepareWrite: () => resolve({closed: true}),
  write: data => { },
  closeWrite: err => { },
  isClosed: () => ({})
})

export let emptyStreamable = closeErr => ({
  reusable: true,
  contentLength: 0,
  toStream: () => resolve(emptyReadStream(closeErr)),
  toText: () => resolve(''),
  toBuffer: () => resolve(new Buffer(0))
})