import path from 'path'
import fs from 'fs'

export class BaseFile {
    dependencies = []

    constructor(qmlify, filename, out_filename) {
        this.qmlify = qmlify
        this.filename = path.relative(qmlify.src_dirname, filename)

        this.basename = path.basename(this.filename)
        this.dirname = path.dirname(this.filename)

        this.src_filename = path.resolve('', filename)
        this.src_dirname = path.dirname(this.src_filename)

        this.out_filename = out_filename ? out_filename
                                         : qmlify.out_dirname ? path.resolve(qmlify.out_dirname, this.filename)
                                                              : null
        this.out_dirname = this.out_filename ? path.dirname(this.out_filename) : null

        qmlify.files.push(this)
    }

    resolve(localFilename) {
        return path.resolve(this.src_dirname, localFilename)
    }

    require(importPath) {
        return this.qmlify.dependencyManager.require(importPath, this)
    }

    build() {
        this.text = fs.readFileSync(this.src_filename, 'utf8')
        this.transform()
    }

    save() {
        throw new Error('Method not implemented!')
    }

    dump() {
        console.log(this.text)
    }

    transform() {
        throw new Error('Method not implemented!')
    }
}
