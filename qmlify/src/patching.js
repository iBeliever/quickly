import fs from 'fs'
import path from 'path'
import {applyPatch} from 'diff'

export function patch(file, filename) {
    if (file.patched)
        return

    const patch_filename = path.resolve(__dirname, '../patches', filename)

    if (!fs.existsSync(patch_filename))
        return

    const patch = fs.readFileSync(patch_filename, 'utf-8')

    const patched = applyPatch(file.text, patch)

    if (!patched) {
        throw new Error(`Unable to patch file: ${filename}`)
    } else {
        file.text = patched
        file.patched = true
        file.findGlobals()
    }
}
