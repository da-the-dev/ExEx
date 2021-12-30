import * as isWSL from 'is-wsl'

const slash = isWSL ? '/' : process.platform === 'win32' ? '\\' : '/'
const slasher = (path: string) => path.replace('/', slash)

export { slash, slasher }