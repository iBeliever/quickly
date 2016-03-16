import fs from 'fs'
import path from 'path'
import assert from 'assert'

export class DependencyManager {
    constructor() {
        this.dependencyMap = {}
    }

    require(importPath, context) {
        assert.ok(importPath)
        assert.ok(context)

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
            throw new ImportError(`Unable to find local file: ${filename} (resolved to ${context.resolve(filename)})`)

        // TODO: Build the local file

        return new Dependency(`"${importPath}.js"`, importPath)
    }
}

class DependencyCycleError extends Error {}

class ImportError extends Error {}

class Dependency {
    constructor(id, importPath) {
        this.id = id
        this.importPath = importPath
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
