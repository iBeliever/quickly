import {DependencyManager} from './dependencies'
import {JSFile} from './jsfile'
import fs from 'fs'
import path from 'path'

export class QMLify {
    constructor(build_dir, { polyfills = true, babel = true }) {
        this.build_dir = build_dir
        this.usePolyfills = polyfills
        this.useBabel = babel

        this.dependencyManager = new DependencyManager()

        if (this.useBabel) {
            this.babelOptions = JSON.parse(fs.readFileSync('.babelrc'))
        }
    }

    build(filename, base_dir) {
        if (!base_dir)
            base_dir = process.cwd()

        if (isDir(filename)) {
            const files = fs.readdirSync(filename)

            for (const subfile of files) {
                this.build(path.resolve(filename, subfile), filename)
            }
        } else if (filename.endsWith('.js')) {
            const file = new JSFile(this, filename, base_dir)
            file.build()
        } else {
            console.log(`Unrecognized file type: ${filename}`)
        }
    }
}

export default function qmlify(source_files, build_dir, options) {
    const qmlify = new QMLify(build_dir, options)

    for (const file of source_files) {
        qmlify.build(file)
    }
}

function isDir(filename) {
    return fs.statSync(filename).isDirectory()
}

// Compat stuff for NodeJS support
module.exports = qmlify
module.exports.default = qmlify
module.exports.QMLify = QMLify
