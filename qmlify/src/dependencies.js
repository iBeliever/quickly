import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {NPMModule} from './bundle'

const dependencyMap = {}

export function require(importPath, context) {
    assert.ok(importPath)
    assert.ok(context)

    const attempts = [requireLocalFile, requireNPMModule]

    for (const attempt of attempts) {
        const dependency = attempt(importPath, context)

        if (dependency) {
            return dependency
        }
    }

    throw new ImportError(`Unable to find module: ${importPath}`)
}

function requireLocalFile(importPath, context) {
    if (!importPath.startsWith('./') && !importPath.startsWith('../'))
        return

    if (importPath.endsWith('.js'))
        throw new ImportError(`Don't include the '.js' extension when importing local files: ${importPath}`)

    const filename = path.normalize(`${importPath}.js`)
    const src_filename = context.resolve(filename)

    if (!fs.existsSync(src_filename))
        throw new ImportError(`Unable to find local file: ${filename} (resolved to ${src_filename})`)

    const file = context.bundle.build(src_filename)

    return new Dependency(`"${importPath}.js"`, importPath, file)
}

function requireNPMModule(importPath, context) {
    if (importPath.startsWith('./') || importPath.startsWith('../'))
        return

    let moduleName = importPath
    let filename = null

    if (importPath.contains('/')) {
        [moduleName, filename] = importPath.split('/', 1)[0]
    }

    const module = NPMModule.locate(moduleName, context.bundle)

    if (!module)
        return

    if (!filename)
        filename = module.main_filename

    const file = module.require(filename)

    return new Dependency(`"${context.relative(file.out_filename)}"`, importPath, file)
}

class DependencyCycleError extends Error {}

class ImportError extends Error {}

class Dependency {
    constructor(id, importPath, file) {
        this.id = id
        this.importPath = importPath
        this.file = file
    }

    qualifier(importAs) {
        if (importAs) {
            return importAs.startsWith('_') ? `QML${importAs}` : `QML_${importAs}`
        } else {
            let qualifier = this.importPath

            if (qualifier.startsWith('./'))
                qualifier = qualifier.slice(2)

            while (qualifier.startsWith('../'))
                qualifier = `_${qualifier.slice(3)}`

            qualifier = qualifier.replace('/', '_').replace('.', '_').replace('-', '_')

            return `QML_${qualifier}`
        }
    }

    importStatement(qualifier) {
        return `.import ${this.id} as ${qualifier}`
    }

    requireStatement(qualifier) {
        return `require(${qualifier})`
    }
}
