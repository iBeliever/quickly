import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {isDir, getConfigFile} from './util'
import {ImportError, require} from './dependencies'
import {NOT_FOUND, JSON_INDENT_LEVEL} from './util'
import * as qmldir from './qmldir'

export let babelConfig = null

const fileTypes = []

const babelFile = getConfigFile('.babelrc')

if (babelFile)
    babelConfig = JSON.parse(babelFile)

export class Bundle {
    files = {}
    config = {}
    cache = {}

    constructor(src_dirname, out_dirname, { name, parentBundle, usePolyfills = true, useBabel = true } = {}) {
        this.name = name
        this.parentBundle = parentBundle
        this.src_dirname = src_dirname ? path.resolve(src_dirname) : process.cwd()
        this.out_dirname = out_dirname ? path.resolve(out_dirname) : null
        this.usePolyfills = usePolyfills
        this.useBabel = useBabel

        this.load()
    }

    get rootBundle() {
        return this.parentBundle || this
    }

    get bundleInfo() {
        if (!this.qmldir)
            return null

        const bundleInfo = {
            name: this.qmldir.moduleName,
            resources: {},
            globals: {},
            exports: this.config.exports
        }

        for (const [resourceName, resource] of Object.entries(this.qmldir.resources)) {
            const file = this.files[resource.filename]

            if (!file) {
                throw new ImportError(`Resource referenced by qmldir not found: ${resource.filename}`)
            }


            bundleInfo.resources[resourceName] = {
                latestVersion: resource.latestVersion,
                globals: file.exportedGlobals
            }

            for (const name of file.exportedGlobals)
                bundleInfo.globals[name] = resourceName
        }

        return bundleInfo
    }

    get resources() {
        const resources = Object.values(this.files)
            .map(file => path.relative(this.out_dirname, file.out_filename))
            .sort()

        if (this.qmldir)
            resources.push('qmldir')

        return resources
    }

    load() {
        this.qmldir = qmldir.load(this.src_dirname)

        const quicklyFilename = this.resolve('quickly.json')

        if (fs.existsSync(quicklyFilename))
            this.config = JSON.parse(fs.readFileSync(quicklyFilename, 'utf-8'))

        if (this.out_dirname) {
            const cacheFilename = path.resolve(this.out_dirname, '.qmlifycache')

            if (fs.existsSync(cacheFilename)) {
                this.cache = JSON.parse(fs.readFileSync(cacheFilename, 'utf-8'))
            }
        }
    }

    patch(file) {
        // Nothing to do here
    }

    relative(filename) {
        return path.relative(this.out_dirname, filename)
    }

    resolve(localFilename) {
        const filename = path.resolve(this.src_dirname, localFilename)

        if (!filename.startsWith(path.resolve(this.src_dirname)))
            throw new Error(`Resolved filename is outside of the bundle: ${localFilename} (resolved to ${filename})`)

        return filename
    }

    build_all() {
        this.build_dir(this.src_dirname)
        this.build_qmldir()
    }

    build_qmldir() {
        if (!this.qmldir)
            return

        for (const resource of Object.values(this.qmldir.resources)) {
            let file = this.files[resource.filename]

            if (!file) {
                const match = resource.filename.match(/dependencies\/(.*)\.js/)
                if (match) {
                    try {
                        const filename = match[1]
                        const dependency = require(filename, this)

                        file = dependency.file
                    } catch (error) {
                        if (error instanceof ImportError) {
                            error.message += ' (exported in the qmldir)'
                        }

                        throw error
                    }
                } else {
                    throw new ImportError(`Resource referenced by qmldir not found: ${resource.filename}`)
                }
            }
        }
    }

    build_dir(dirname) {
        assert.ok(dirname)

        const files = fs.readdirSync(dirname)

        for (const file of files) {
            const filename = path.resolve(dirname, file)

            if (filename === path.resolve('', this.out_dirname) || filename.endsWith('node_modules')) {
                continue
            } else if (isDir(filename)) {
                this.build_dir(filename)
            } else {
                try {
                    this.build(filename)
                } catch (error) {
                    // Ignore unknown file types when building everything in a directory
                    if (!(error instanceof FileTypeError)) {
                        throw error
                    }
                }
            }
        }
    }

    getFile(filename, {fromCache = false, ...options} = {}) {
        if (filename in this.files)
            return this.files[filename]

        for (const [regex, fileType] of fileTypes) {
            if (filename.search(regex) !== NOT_FOUND) {
                let file = null

                if (fromCache) {
                    const cache = this.rootBundle.cache[filename]

                    if (cache) {
                        let bundle = this

                        if (cache.bundle && cache.bundle.src_dirname !== this.src_dirname) {
                            bundle = new Bundle(cache.bundle.src_dirname, cache.bundle.out_dirname)
                        }

                        Object.assign(options, {
                            'out_filename': cache['out_filename']
                        })

                        file = new fileType(cache['src_filename'], bundle, options)
                        file.loadFromCache(cache)
                    } else if (!filename.startsWith('dependencies/')) {
                        file = new fileType(this.resolve(filename), this, options)
                    } else {
                        throw new ImportError(`Dependency has not been built before: ${filename}`)
                    }
                } else {
                    file = new fileType(this.resolve(filename), this, options)
                }

                if (!fs.existsSync(file.src_filename))
                    throw new ImportError(`File doesn't exist: ${filename} (resolved to ${file.src_filename})`)

                this.files[file.filename] = file

                if (this.parentBundle) {
                    this.parentBundle.files[file.filename] = file
                }

                return file
            }
        }

        throw new FileTypeError(`File type not recognized: ${filename}`)
    }

    build(filename, options) {
        const file = this.getFile(filename, options)

        file.build()

        return file
    }

    save() {
        for (const file of Object.values(this.files)) {
            file.save()
        }

        const bundleInfo = this.bundleInfo

        if (bundleInfo)
            fs.writeFileSync(path.resolve(this.out_dirname, 'quickly.json'),
                             JSON.stringify(bundleInfo, null, JSON_INDENT_LEVEL))

        fs.writeFileSync(path.resolve(this.out_dirname, '.qmlifycache'),
                         JSON.stringify(this.cache, null, JSON_INDENT_LEVEL))

        const resources = this.resources.map(resource => `\t<file>${resource}</file>`).join('\n')
        const prefix = bundleInfo ? `/${bundleInfo.name}` : '/'
        const qrc = `<!DOCTYPE RCC>\n<RCC version="1.0">\n\n<qresource prefix="${prefix}">\n${resources}\n</qresource>\n\n</RCC>\n`

        fs.writeFileSync(path.resolve(this.out_dirname, 'resources.qrc'), qrc)

        if (this.qmldir) {
            const qmldir = fs.readFileSync(path.resolve(this.src_dirname, 'qmldir'), 'utf-8')

            fs.writeFileSync(path.resolve(this.out_dirname, 'qmldir'), qmldir)
        }
    }

    dependencies(source, base_dirname) {
        let deps = []

        if (!source) {
            source = this.src_dirname

            if (this.qmldir) {
                deps = Object.values(this.qmldir.resources).map(resource => {
                    try {
                        return this.getFile(resource.filename, { fromCache: true}).src_filename
                    } catch (error) {
                        if (error instanceof ImportError && resource.filename.startsWith('dependencies/')) {
                            return null
                        } else {
                            throw error
                        }
                    }
                }).filter(filename => !!filename)
            }
        }

        if (!base_dirname)
            base_dirname = this.src_dirname

        if (this.qmldir)
            deps.push(this.resolve('qmldir'))
        if (this.config)
            deps.push(this.resolve('quickly.json'))

        if (fs.existsSync(source) && isDir(source)) {
            const files = fs.readdirSync(source)

            for (const file of files) {
                const filename = path.resolve(source, file)

                if (this.out_dirname && filename === path.resolve('', this.out_dirname))
                    continue

                deps = deps.concat(this.dependencies(filename))
            }
        } else {
            source = path.resolve(this.out_dirname, source)

            try {
                const file = this.getFile(path.relative(base_dirname, source), { fromCache: true })

                deps.push(file.src_filename)

                for (const dependency of Object.values(file.dependencies)) {
                    deps = deps.concat(this.dependencies(dependency.filename, this.out_dirname))
                }
            } catch (error) {
                if (!(error instanceof FileTypeError)) {
                    throw error
                }
            }
        }

        return deps.filter((item, index) => {
            return deps.indexOf(item) === index
        })
    }
}

export function build(filename, bundle_or_options) {
    assert.ok(filename)

    let bundle = null
    let options = {}
    let out_filename = null

    if (bundle_or_options instanceof Bundle) {
        bundle = bundle_or_options
    } else if (bundle_or_options) {
        ({bundle, out_filename, ...options} = bundle_or_options)

        if (!bundle)
            bundle = new Bundle(null, null, options)
    }

    return bundle.build(filename, { out_filename })
}

export class FileTypeError extends ExtendableError {}

export function registerFileType(regex, fileType) {
    fileTypes.push([regex, fileType])
}
