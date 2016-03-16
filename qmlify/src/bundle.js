import {JSFile} from './jsfile'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

export let babelConfig = null
const filesCache = {}

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

            if (isDir(filename)) {
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
        for (const file of Object.values(this.files)) {
            file.save()
        }
    }
}

export class NPMModule extends Bundle {
    constructor(name, parentBundle) {
        super(path.resolve('node_modules', name), parentBundle.out_dirname, { useBabel: false, usePolyfills: false })
        this.name = name
    }

    load() {
        this.config = JSON.parse(fs.readFileSync(path.join(this.dirname, 'package.json'), 'utf8'))
    }

    require(filename) {
        return this.build(filename)
    }

    get main_filename() {
        const filename = this.config['main']

        return filename ? filename : 'index.js'
    }

    get exists() {
        return fs.existsSync(this.dirname)
    }

    static locate(name, parentBundle) {
        const module = NPMModule(name, parentBundle)

        if (!module.exists)
            return

        module.load()

        return module
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

    if (filename.endsWith('.js')) {
        const file = new JSFile(filename, options)
        file.build()

        filesCache[file.src_filename] = file

        return file
    } else {
        throw new Error(`Unrecognized file type: ${filename}`)
    }
}

export const localBundle = new Bundle()

function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}
