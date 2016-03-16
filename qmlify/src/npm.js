import {Bundle} from './bundle'
import path from 'path'
import fs from 'fs'

export class Module extends Bundle {
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

    static locate(name) {
        const module = Module(name)

        if (!module.exists)
            return

        module.load()

        return module
    }
}
