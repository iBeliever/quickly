import {Bundle} from './bundle'
import {requireHook, Dependency} from './dependencies'
import fs from 'fs'
import path from 'path'

export class Package extends Bundle {
    constructor(name, parentBundle) {
        super(path.resolve('node_modules', name),
                path.resolve(parentBundle.out_dirname ? parentBundle.out_dirname : '', 'dependencies', name),
                { useBabel: false, usePolyfills: false })
        this.name = name
    }

    load() {
        this.config = JSON.parse(fs.readFileSync(path.join(this.src_dirname, 'package.json'), 'utf8'))
    }

    require(filename) {
        return this.build(path.resolve(this.src_dirname, filename))
    }

    get main_filename() {
        const filename = this.config['main']

        return filename ? filename : 'index.js'
    }

    get exists() {
        return fs.existsSync(this.src_dirname)
    }

    static locate(name, parentBundle) {
        const module = new Package(name, parentBundle)

        if (!module.exists)
            return

        module.load()

        return module
    }
}

export function requireModule(importPath, context) {
    if (importPath.startsWith('./') || importPath.startsWith('../'))
        return

    let moduleName = importPath
    let filename = null

    if (importPath.includes('/')) {
        [moduleName, filename] = importPath.split('/', 1)[0]
    }

    if (moduleName.endsWith('.js'))
        throw new Error('Only npm packages are supported, not simple modules')

    const module = Package.locate(moduleName, context.bundle)

    if (!module)
        return

    if (!filename)
        filename = module.main_filename

    const file = module.require(filename)

    return new Dependency(`"${context.relative(file.out_filename)}"`, importPath, file)
}

requireHook(requireModule)
