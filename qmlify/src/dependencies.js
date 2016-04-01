import ExtendableError from 'es6-error'
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import {Bundle} from './bundle'

const dependencyMap = {}
const requireHooks = [requireLocalFile]

const LOCAL_PREFIX = './'
const PARENT_PREFIX = '../'

export function requireHook(hook) {
    requireHooks.push(hook)
}

export function checkDependency(name, target, chain) {
    if (!dependencyMap[name])
        return

    const dependencies = dependencyMap[name]

    if (!chain)
        chain = [target, name]

    for (const dep of dependencies) {
        const newChain = chain.concat([dep])

        if (dep === name)
            throw new Error(`Module cannot depend on itself: ${dep}`)

        if (dep === target)
            throw new DependencyCycleError(`Dependency cycle: ${newChain.join(' - ')}`)
        else
            checkDependency(dep, target, newChain)
    }
}

export function addDependency(source, dependency) {
    if (source === dependency)
        throw new Error(`Module cannot depend on itself: ${source}`)

    if (!dependencyMap[source])
        dependencyMap[source] = []
    dependencyMap[source].push(dependency)

    checkDependency(dependency, source)
}

export function require(importPath, context) {
    assert.ok(importPath)
    assert.ok(context)

    let dependency = null

    for (const requireHook of requireHooks) {
        dependency = requireHook(importPath, context, false)

        if (dependency)
            break
    }

    if (!dependency)
        throw new ImportError(`Unable to find module: ${importPath}`)

    if (dependency.file) {
        if (context.filename) {
            addDependency(context.filename, dependency.filename)
        }

        dependency.file.build()

        dependency.globals = dependency.file.exportedGlobals
    }

    return dependency
}

function requireLocalFile(importPath, context) {
    if (!importPath.startsWith('./') && !importPath.startsWith('../'))
        return null

    if (context instanceof Bundle)
        return null

    if (importPath.endsWith('.js'))
        throw new ImportError(`Don't include the '.js' extension when importing local files: ${importPath}`)

    const filename = path.normalize(`${importPath}.js`)

    if (fs.existsSync(context.resolve(filename))) {
        const file = context.bundle.build(context.resolve(filename))

        return new Dependency(`"${importPath}.js"`, importPath, file)
    } else if (context.bundle.parentBundle && fs.existsSync(context.bundle.parentBundle.resolve(filename))) {
        const file = context.bundle.parentBundle.build(context.bundle.parentBundle.resolve(filename))

        return new Dependency(`"${context.relative(file.out_filename)}"`, importPath, file)
    } else {
        throw new ImportError(`Unable to find local file: ${filename} (resolved to ${context.resolve(filename)})`)
    }
}

export class Dependency {
    globals = []

    constructor(id, importPath, file) {
        this.id = id
        this.importPath = importPath
        this.file = file

        if (file) {
            this.filename = file.filename
            this.globals = file.exportedGlobals
        }
    }

    static fromJSON(json) {
        const dep = new Dependency()

        dep.globals = json['globals']
        dep.filename = json['filename']

        return dep
    }

    get json() {
        return {
            'filename': this.filename,
            'globals': this.globals
        }
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
