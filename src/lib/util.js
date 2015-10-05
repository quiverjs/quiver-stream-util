import { error } from 'quiver-util/error'

export const streamOpener = () => {
  let opened = false

  return () => {
    if(opened)
      throw error(500, 'streamable is non-reusable ' +
        'and can only be opened once')

    opened = true
  }
}
