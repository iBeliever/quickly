import {Bundle} from './bundle'
import {requireHook, Dependency} from './dependencies'
import {patch} from './patching'
import {findFile} from './util'
import fs from 'fs'
import path from 'path'

export class Package extends Bundle {
    constructor(name, parentBundle) {
        super(null, path.resolve(parentBundle.out_dirname ? parentBundle.out_dirname : '',
                                 'dependencies', name),
              { name: name, parentBundle: parentBundle, useBabel: false, usePolyfills: false })
    }

    locate() {
        this.src_dirname = findFile(path.join('node_modules', this.name),
                                    this.parentBundle.src_dirname)

        return this.exists
    }

    load() {
        if (!this.locate())
            return
        super.load()
        this.config = JSON.parse(fs.readFileSync(path.join(this.src_dirname, 'package.json'), 'utf8'))
    }

    build(filename) {
        const file = super.build(filename, { useBabel: filename.includes('src' ) })

        patch(file, path.join(this.name, path.relative(this.src_dirname, filename)))

        return file
    }

    require(filename) {
        if (!filename)
            filename = this.main_filename
        return this.build(path.resolve(this.src_dirname, filename))
    }

    get main_filename() {
        const filename = this.config['main']

        return filename ? filename : 'index.js'
    }

    get exists() {
        return !!this.src_dirname
    }

    static locate(name, parentBundle) {
        const module = new Package(name, parentBundle.parentBundle || parentBundle)

        if (!module.exists)
            return

        return module
    }
}

export function requireModule(importPath, context) {
    if (importPath.startsWith('./') || importPath.startsWith('../'))
        return

    let moduleName = importPath
    let filename = null

    if (importPath.includes('/')) {
        [moduleName, ...filename] = importPath.split('/')

        filename = filename.join('/') + '.js'
    }

    if (moduleName.endsWith('.js'))
        throw new Error('Only npm packages are supported, not simple modules')

    const module = Package.locate(moduleName, context.bundle)

    if (!module)
        return

    const file = module.require(filename)

    console.log(`Resolved "${importPath}" as npm module: ${context.relative(file.out_filename)}`)

    return new Dependency(`"${context.relative(file.out_filename)}"`, importPath, file)
}

requireHook(requireModule)
