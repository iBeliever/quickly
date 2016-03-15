import path from 'path'

export class BaseFile {
    filename
    dirname
    dependencies = []

    constructor(qmlify, filename) {
        this.qmlify = qmlify
        this.filename = filename

        this.basename = path.basename(filename)
        this.dirname = path.dirname(filename)
    }

    resolve(localFilename) {
        return path.resolve(this.dirname, localFilename)
    }

    require(importPath) {
        return this.qmlify.require(importPath, this)
    }

    build() {
        this.text = ''
    }

    transform() {
        throw new Error('Method not implemented!')
    }
}
