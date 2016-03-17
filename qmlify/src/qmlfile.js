import {BaseFile} from './basefile'

export class QMLFile extends BaseFile {
    transform() {
        // Do nothing for now
    }
}

QMLFile.registerFileType(/\.qml$/)
