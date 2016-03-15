import fs from 'fs'
import path from 'path'

export class DependencyManager {
    constructor() {
        this.dependencyMap = {}
    }

    require(importPath, context) {
        const attempts = [this.requireLocalFile]

        for (const attempt of attempts) {
            const dependency = attempt(importPath, context)

            if (dependency) {
                return dependency
            }
        }

        throw new ImportError(`Unable to find module: ${importPath}`)
    }

    requireLocalFile(importPath, context) {
        if (!importPath.startsWith('./') && !importPath.startsWith('../'))
            return

        if (importPath.endsWith('.js'))
            throw new ImportError(`Don't include the '.js' extension when importing local files: ${importPath}`)

        const filename = path.normalize(`${importPath}.js`)

        if (!fs.existsSync(context.resolve(filename)))
            throw new ImportError(`Unable to find local file: ${filename}`)

        // TODO: Build the local file

        return new Dependency(`"${importPath}.js"`)
    }
}

class DependencyCycleError extends Error {}

class ImportError extends Error {}

class Dependency {
    constructor(id) {
        this.id = id
    }

    importStatement(qualifier) {
        return `.import ${this.id} as ${qualifier}`
    }

    requireStatement(qualifier) {
        return `require(${qualifier})`
    }
}
