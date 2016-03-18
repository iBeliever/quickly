import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {isDir, getConfigFile} from './util'
import * as qmldir from './qmldir'

export let babelConfig = null
export let qmlifyConfig = null
const filesCache = {}
const fileTypes = []

const babelFile = getConfigFile('.babelrc')

if (babelFile)
    babelConfig = JSON.parse(babelFile)

const qmlifyFile = getConfigFile('quickly.json')

if (babelFile)
    qmlifyConfig = JSON.parse(qmlifyFile)

export class Bundle {
    files = {}

    constructor(src_dirname, out_dirname, { usePolyfills = true, useBabel = true } = {}) {
        this.src_dirname = src_dirname ? src_dirname : process.cwd()
        this.out_dirname = out_dirname
        this.usePolyfills = usePolyfills
        this.useBabel = useBabel

        this.load()
    }

    load() {
        this.qmldir = qmldir.load(this.src_dirname)
        console.log(this.qmldir)
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
                try {
                    this.build(filename)
                } catch (error) {
                    if (error instanceof FileTypeError) {
                        console.warn(error.message)
                    } else {
                        throw error
                    }
                }
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

        fs.writeFileSync(path.resolve(this.out_dirname, 'quickly.json'), JSON.stringify(this.bundleInfo, null, 2))
    }

    get bundleInfo() {
        if (!this.qmldir)
            return null

        const bundleInfo = {
            moduleName: this.qmldir.moduleName,
            resources: {}
        }

        for (const [resourceName, resource] of Object.entries(this.qmldir.resources)) {
            const file = this.files[resource.filename]

            if (!file)
                throw new Error(`Resource referenced by qmldir not found: ${filename}`)

            bundleInfo.resources[resourceName] = {
                latestVersion: resource.latestVersion,
                globals: file.exportedGlobals
            }
        }

        return bundleInfo
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

            file.bundle.files[file.filename] = file

            if (file.bundle.parentBundle)
                file.bundle.parentBundle.files[file.filename] = file

            return file
        }
    }

    throw new FileTypeError(`File type not recognized: ${filename}`)
}

export class FileTypeError extends ExtendableError {}

export function registerFileType(regex, fileType) {
    fileTypes.push([regex, fileType])
}

export const localBundle = new Bundle()
