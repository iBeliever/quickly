import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {isDir, getConfigFile} from './util'
import * as qmldir from './qmldir'

export let babelConfig = null
const filesCache = {}
const fileTypes = []

const babelFile = getConfigFile('.babelrc')

if (babelFile)
    babelConfig = JSON.parse(babelFile)

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

        const quicklyFilename = path.resolve(this.src_dirname, 'quickly.json')

        if (fs.existsSync(quicklyFilename))
            this.config = JSON.parse(fs.readFileSync(quicklyFilename, 'utf-8'))
        else
            this.config = null
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

    build(filename, options) {
        if (!options)
            options = {}
        options.bundle = this
        return build(filename, options)
    }

    save() {
        for (const file of Object.values(this.files)) {
            file.save()
        }

        const bundleInfo = this.bundleInfo

        if (bundleInfo)
            fs.writeFileSync(path.resolve(this.out_dirname, 'quickly.json'), JSON.stringify(bundleInfo, null, 2))
    }

    get bundleInfo() {
        if (!this.qmldir)
            return null

        const bundleInfo = {
            name: this.qmldir.moduleName,
            resources: {},
            globals: {}
        }

        if (this.config)
            bundleInfo.exports = this.config.exports

        for (const [resourceName, resource] of Object.entries(this.qmldir.resources)) {
            const file = this.files[resource.filename]

            if (!file)
                throw new Error(`Resource referenced by qmldir not found: ${resource.filename}`)

            bundleInfo.resources[resourceName] = {
                latestVersion: resource.latestVersion,
                globals: file.exportedGlobals
            }

            for (const name of file.exportedGlobals)
                bundleInfo.globals[name] = resourceName
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
