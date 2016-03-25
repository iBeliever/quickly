import fs from 'fs'
import path from 'path'

export const NOT_FOUND = -1
export const JSON_INDENT_LEVEL = 2

export function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}

export function getConfigFile(filename, dirname) {
    if (!dirname)
        dirname = process.cwd()

    const p = findFile(filename, dirname)

    if (p)
        return fs.readFileSync(p)
    else
        return null
}

export function findFile(filename, dirname) {
    if (!dirname)
        dirname = process.cwd()


    if (fs.existsSync(path.join(dirname, filename)))
        return path.join(dirname, filename)

    if (dirname !== '/')
        return findFile(filename, path.resolve(dirname, '..'))
    else
        return null
}
