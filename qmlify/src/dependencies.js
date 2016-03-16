import fs from 'fs'
import path from 'path'
import assert from 'assert'

export class DependencyManager {
    constructor(qmlify) {
        this.qmlify = qmlify
        this.dependencyMap = {}
    }

    require(importPath, context) {
        assert.ok(importPath)
        assert.ok(context)

        const attempts = [this.requireLocalFile]

        for (const attempt of attempts) {
            const dependency = attempt.call(this, importPath, context)

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
        const src_filename = context.resolve(filename)

        if (!fs.existsSync(src_filename))
            throw new ImportError(`Unable to find local file: ${filename} (resolved to ${src_filename})`)

        const file = this.qmlify.build(src_filename)

        return new Dependency(`"${importPath}.js"`, importPath, file)
    }
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
