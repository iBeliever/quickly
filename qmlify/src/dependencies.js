import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {Bundle} from './bundle'

// const dependencyMap = {}
const requireHooks = [requireLocalFile]

const LOCAL_PREFIX = './'
const PARENT_PREFIX = '../'

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
        return null

    if (context instanceof Bundle)
        return null

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

    importQualifier(importAs) {
        if (importAs) {
            return importAs.startsWith('_') ? `QML${importAs}` : `QML_${importAs}`
        } else {
            // eslint-disable-next-line
            let qualifier = this.importPath.split(' ', 1)[0]

            if (qualifier.startsWith(LOCAL_PREFIX))
                qualifier = qualifier.slice(LOCAL_PREFIX.length)

            while (qualifier.startsWith(PARENT_PREFIX))
                qualifier = `_${qualifier.slice(PARENT_PREFIX.length)}`

            qualifier = qualifier.replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_')

            return `QML_${qualifier}`
        }
    }

    qualifier(importAs) {
        if (this.typeName)
            return `${this.importQualifier(importAs)}.${this.typeName}`
        else
            return this.importQualifier(importAs)
    }

    importStatement(importAs) {
        const qualifier = this.importQualifier(importAs)
        return `.import ${this.id} as ${qualifier}`
    }

    requireStatement(importAs) {
        const qualifier = this.qualifier(importAs)
        return `require(${qualifier})`
    }
}

export class DependencyCycleError extends ExtendableError {}

export class ImportError extends ExtendableError {}
