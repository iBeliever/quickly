import {DependencyManager} from './dependencies'
import {JSFile} from './jsfile'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import 'source-map-support/register'

export class QMLify {
    files = []

    constructor(src_dirname, out_dirname, { polyfills = true, babel = true }) {
        this.src_dirname = src_dirname ? src_dirname : process.cwd()
        this.out_dirname = out_dirname
        this.usePolyfills = polyfills
        this.useBabel = babel

        this.dependencyManager = new DependencyManager()

        if (this.useBabel) {
            this.babelOptions = JSON.parse(fs.readFileSync('.babelrc'))
        }
    }

    build_all() {
        this.build_dir(this.src_dirname)
    }

    save() {
        for (const file of this.files) {
            file.save()
        }
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
        assert.ok(filename)

        if (filename.endsWith('.js')) {
            const file = new JSFile(this, filename)
            file.build()

            return file
        } else {
            console.warn(`Unrecognized file type: ${filename}`)
        }
    }
}

export function build_dir(src_dirname, out_dirname, options) {
    const qmlify = new QMLify(src_dirname, out_dirname, options)

    qmlify.build_all()

    qmlify.save()
}

export function build_file(src_filename, out_filename, options) {
    const qmlify = new QMLify(null, null, options)

    const file = qmlify.build(src_filename)

    if (out_filename)
        file.save(out_filename)
    else
        file.dump()
}

function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}
