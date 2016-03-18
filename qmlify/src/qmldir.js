import fs from 'fs'
import path from 'path'

export function load(dirname) {
    const filename = path.resolve(dirname, 'qmldir')

    if (!fs.existsSync(filename))
        return null

    const text = fs.readFileSync(filename, 'utf-8')

    const qmldir = {
        moduleName: '',
        resources: {}
    }

    for (const line of text.split('\n')) {
        let match = null

        if ((match = line.match(/module (.*)/)) !== null) {
            qmldir.moduleName = match[1]
        } else if ((match = line.match(/(.*) (\d.\d) (.*\.js)/)) !== null) {
            qmldir.resources[match[1]] = {
                latestVersion: match[2],
                filename: match[3]
            }
        }
    }

    return qmldir
}
