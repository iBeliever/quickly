import {registerFileType} from './bundle'
import {require} from './dependencies'
import path from 'path'
import fs from 'fs'
import {ImportError, Dependency} from './dependencies'
import _ from 'lodash'
import assert from 'assert'

export class BaseFile {
    dependencies = {}

    constructor(filename, bundle, {out_filename, useBabel, usePolyfills, ...options} = {}) {
        assert.ok(filename, 'Filename must provided!')
        assert.ok(bundle, 'Bundle must be provided!')

        this.bundle = bundle
        this.useBabel = useBabel !== undefined ? useBabel : bundle.useBabel
        this.usePolyfills = usePolyfills !== undefined ? usePolyfills : bundle.usePolyfills
        this.options = options

        const rel_filename = path.relative(bundle.src_dirname, filename)

        this.src_filename = path.resolve(filename)
        this.src_dirname = path.dirname(this.src_filename)
        
        if (!this.src_filename.startsWith(path.resolve(bundle.src_dirname)))
            throw new Error('File must be inside the bundle!')

        this.out_filename = out_filename ? path.resolve(out_filename)
                                         : bundle.out_dirname ? path.resolve(bundle.out_dirname, rel_filename)
                                                              : null
        this.out_dirname = this.out_filename ? path.dirname(this.out_filename) : null

        if (this.out_filename && bundle.out_dirname) {
            assert.ok(this.out_filename.startsWith(path.resolve(bundle.out_dirname)),
                      'out_filename should be inside the bundle\'s out_dirname')

            this.filename = path.relative(bundle.out_dirname, this.out_filename)
        } else {
            this.filename = rel_filename
        }

        this.basename = path.basename(this.filename)
        this.local_dirname = path.dirname(this.filename)
    }

    loadFromCache(cache) {
        this.dependencies = _.mapValues(cache['dependencies'], json => Dependency.fromJSON(json))
    }

    get cache() {
        return {
            'src_filename': this.src_filename,
            'out_filename': this.out_filename,
            'dependencies': _.mapValues(this.dependencies, dep => dep.json)
        }
    }

    relative(filename) {
        return path.relative(this.out_dirname ? this.out_dirname : path.resolve(this.src_dirname),
                             filename)
    }

    resolve(localFilename) {
        const filename = path.resolve(this.src_dirname, localFilename)

        if (!filename.startsWith(path.resolve(this.bundle.src_dirname)))
            throw new Error(`Resolved filename is outside of the bundle: ${localFilename} (resolved to ${filename})`)

        return filename
    }

    require(importPath) {
        try {
            return require(importPath, this)
        } catch (error) {
            if (error instanceof ImportError) {
                error.message += ` (imported from ${this.filename})`
                throw error
            } else {
                throw error
            }
        }
    }

    build() {
        if (this.isBuilt)
            return

        this.text = this.sourceText = fs.readFileSync(this.src_filename, 'utf8').trim() + '\n'

        try {
            this.bundle.patch(this)

            this.transform()
            this.isBuilt = true
        } catch (error) {
            if (this.out_filename) {
                mkdirs(this.out_dirname)
                fs.writeFileSync(this.out_filename.replace('.js', '-orig.js'), this.sourceText)
            }

            throw error
        }

        (this.bundle.parentBundle || this.bundle).cache[this.filename] = this.cache
    }

    save() {
        mkdirs(this.out_dirname)
        fs.writeFileSync(this.out_filename, this.text)
    }

    dump() {
        console.log(this.text)
    }

    transform() {
        throw new Error('Method not implemented!')
    }

    static registerFileType(regex) {
        registerFileType(regex, this)
    }
}

function mkdirs(filename) {
    if (fs.existsSync(filename))
        return

    mkdirs(path.dirname(filename))

    fs.mkdirSync(filename)
}
