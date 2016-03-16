import path from 'path'
import fs from 'fs'

export class BaseFile {
    dependencies = []

    constructor(qmlify, filename, base_dir) {
        this.qmlify = qmlify
        this.base_dir
        this.filename = path.relative(base_dir, filename)

        this.basename = path.basename(filename)
        this.dirname = path.dirname(filename)

        this.src_filename = path.relative('', filename)
        this.out_filename = path.resolve(qmlify.build_dir, this.filename)
        this.out_dirname = path.dirname(this.out_filename)
    }

    resolve(localFilename) {
        return path.resolve(this.out_dirname, localFilename)
    }

    require(importPath) {
        return this.qmlify.require(importPath, this)
    }

    build() {
        this.text = fs.readFileSync(this.src_filename, 'utf8')
        this.transform()
    }

    transform() {
        throw new Error('Method not implemented!')
    }
}
