import fs from 'fs'
import path from 'path'
import assert from 'assert'

export let babelConfig = null
const filesCache = {}
const fileTypes = []

if (fs.existsSync('.babelrc'))
    babelConfig = JSON.parse(fs.readFileSync('.babelrc'))

export class Bundle {
    constructor(src_dirname, out_dirname, { usePolyfills = true, useBabel = true } = {}) {
        this.src_dirname = src_dirname ? src_dirname : process.cwd()
        this.out_dirname = out_dirname
        this.usePolyfills = usePolyfills
        this.useBabel = useBabel
    }

    build_all() {
        this.build_dir(this.src_dirname)
    }

    build_dir(dirname) {
        assert.ok(dirname)

        const files = fs.readdirSync(dirname)

        for (const file of files) {
            const filename = path.resolve(dirname, file)

            if (filename == path.resolve('', this.out_dirname) || filename.endsWith('node_modules')) {
                continue
            } else if (isDir(filename)) {
                this.build_dir(filename)
            } else {
                this.build(filename)
            }
        }
    }

    build(filename) {
        return build(filename, this)
    }

    save() {
        for (const file of Object.values(filesCache)) {
            file.save()
        }
    }
}

export function build(filename, bundle_or_options) {
    assert.ok(filename)

    if (filename in filesCache) {
        return filesCache[filename]
    }

    let options = {}

    if (bundle_or_options instanceof Bundle) {
        options.bundle = bundle_or_options
    } else if (bundle_or_options) {
        options = bundle_or_options
    }

    if (!options.bundle)
        options.bundle = localBundle

    for (const [regex, fileType] of fileTypes) {
        if (filename.search(regex) !== -1) {
            const file = new fileType(filename, options)
            file.build()

            filesCache[file.src_filename] = file

            return file
        }
    }

    throw new Error(`File type not recognized: ${filename}`)
}

export function registerFileType(regex, fileType) {
    fileTypes.push([regex, fileType])
}

export const localBundle = new Bundle()

function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}
