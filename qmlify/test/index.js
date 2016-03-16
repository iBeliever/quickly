import path from 'path'
import fs from 'fs'
import assert from 'assert'
import {QMLify} from '../src'

function trim(str) {
    return str.replace(/^\s+|\s+$/, '')
}

describe('', () => {
    const fixturesDir = path.join(__dirname, 'fixtures')

    fs.readdirSync(fixturesDir).map((caseName) => {
        it(`should ${caseName.split('-').join(' ')}`, () => {
            const qmlify = new QMLify(null, null, { polyfills: false, babel: !caseName.includes('es5') })

            const fixtureDir = path.join(fixturesDir, caseName)
            const actualPath = path.join(fixtureDir, 'actual.js')
            const actual = qmlify.build(actualPath).text

            const expected = fs.readFileSync(
                path.join(fixtureDir, 'expected.js')
            ).toString()

            assert.equal(trim(actual), trim(expected))
        })
    })
})
