import {Bundle} from './bundle'
import {requireHook, Dependency} from './dependencies'
import fs from 'fs'
import path from 'path'

export function requireModule(importPath, context) {
    if (importPath.startsWith('./') || importPath.startsWith('../'))
        return

    let moduleName = null
    let version = null
    let typeName = null

    if (importPath.includes(' ')) {
        [moduleName, version] = importPath.split(' ', 1)

        if (moduleName.includes('/')) {
            [moduleName, typeName] = moduleName.split('/', 1)[0]
        }
    }
}

requireHook(requireModule)
