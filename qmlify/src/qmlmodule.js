import {requireHook, Dependency} from './dependencies'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import shell from 'shelljs'

let modules = {}
let moduleAliases = {}

export function requireModule(importPath, context) {
    if (importPath.startsWith('./') || importPath.startsWith('../'))
        return

    let moduleName = null
    let version = null
    let typeName = null

    const bundle = context.bundle.parentBundle || context.bundle

    if (bundle.config.exports && bundle.config.exports[importPath])
        return null

    if (importPath.includes(' ')) {
        [moduleName, version, typeName] = parseImport(importPath)
    } else if (moduleAliases[importPath]) {
        ({moduleName, version, typeName} = moduleAliases[importPath])

        if (bundle.config.dependencies && bundle.config.dependencies[importPath]) {
            version = bundle.config.dependencies[importPath]
        }
    } else {
        return null
    }

    const module = modules[moduleName]

    const dependency = new Dependency(`${moduleName} ${version}`, moduleName.toLowerCase())

    dependency.typeName = typeName
    dependency.globals = module ? typeName ? module.resources[typeName].globals
                                           : module.globals
                                : []

    console.log(`Resolved '${importPath}' as QML import ${moduleName} ${version} [${dependency.globals}]`)

    return dependency
}

function parseImport(importPath) {
    let moduleName = importPath
    let version = null
    let typeName = null

    if (moduleName.includes(' ')) {
        [moduleName, version] = importPath.split(' ')
    }

    if (moduleName.includes('/')) {
        [moduleName, typeName] = moduleName.split('/')
    }

    return [moduleName, version, typeName]
}

export function setImportPath(modulesDirname) {
    const moduleFilenames = glob.sync('**/quickly.json', {cwd: modulesDirname})

    modules = {}
    moduleAliases = {}

    for (const filename of moduleFilenames) {
        const module = JSON.parse(fs.readFileSync(path.join(modulesDirname, filename), 'utf-8'))

        modules[module.name] = module

        for (const [alias, importPath] of Object.entries(module.exports)) {
            const [moduleName, version, typeName] = parseImport(importPath)

            moduleAliases[alias] = {
                moduleName: moduleName,
                version: version ? version
                                 : module.name == moduleName ? module.resources[typeName].latestVersion
                                                             : null,
                typeName: typeName
            }
        }
    }
}

requireHook(requireModule)

setImportPath(shell.exec('qmake -query QT_INSTALL_QML', {silent:true}).stdout.trim())
