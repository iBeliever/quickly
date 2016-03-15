import {DependencyManager} from './dependencies'
import {JSFile} from './jsfile'

export class QMLify {
    constructor() {
        this.dependencyManager = new DependencyManager()
    }

    build(filename) {
        if (filename.endsWith('.js')) {
            const file = new JSFile()
            file.build()
        }
    }
}
