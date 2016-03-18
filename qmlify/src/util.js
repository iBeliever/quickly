import fs from 'fs'
import path from 'path'

export function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}

export function getConfigFile(filename, dirname) {
    if (!dirname)
        dirname = process.cwd()

    if (fs.existsSync(path.join(dirname, filename)))
        return fs.readFileSync(path.join(dirname, filename))

    if (dirname !== '/')
        return getConfigFile(filename, path.resolve(dirname, '..'))
    else
        return null
}
