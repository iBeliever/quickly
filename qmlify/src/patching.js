import fs from 'fs'
import path from 'path'
import {applyPatch} from 'diff'

export function patch(file, patch_filename) {
    patch_filename = path.resolve(__dirname, '../patches', patch_filename)

    if (!fs.existsSync(patch_filename))
        return

    const patch = fs.readFileSync(patch_filename, 'utf-8')

    file.text = applyPatch(file.text, patch)
}
