import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

const dependencyMap = {}
const requireHooks = [requireLocalFile]

export function requireHook(hook) {
    requireHooks.push(hook)
}

export function require(importPath, context) {
    assert.ok(importPath)
    assert.ok(context)

    for (const requireHook of requireHooks) {
        const dependency = requireHook(importPath, context)

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

export class Dependency {
    globals = []

    constructor(id, importPath, file) {
        this.id = id
        this.importPath = importPath
        this.file = file

        if (file)
            this.globals = file.exportedGlobals
    }

    qualifier(importAs) {
        let qualifier = null

        if (importAs) {
            qualifier = importAs.startsWith('_') ? `QML${importAs}` : `QML_${importAs}`
        } else {
            qualifier = this.importPath.split(' ', 1)[0]

            if (qualifier.startsWith('./'))
                qualifier = qualifier.slice(2)

            while (qualifier.startsWith('../'))
                qualifier = `_${qualifier.slice(3)}`

            qualifier = qualifier.replace('/', '_').replace('.', '_').replace('-', '_')

            qualifier = `QML_${qualifier}`
        }

        if (this.typeName)
            return `${qualifier}.${this.typeName}`
        else
            return qualifier
    }

    importStatement(qualifier) {
        return `.import ${this.id} as ${qualifier}`
    }

    requireStatement(qualifier) {
        return `require(${qualifier})`
    }
}

class DependencyCycleError extends ExtendableError {}

class ImportError extends ExtendableError {}
