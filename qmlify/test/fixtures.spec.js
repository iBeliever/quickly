import {expect} from 'chai'

import path from 'path'
import fs from 'fs'
import {build} from '../src'

function trim(str) {
    return str.replace(/^\s+|\s+$/, '')
}

describe('Fixtures', () => {
    const fixturesDir = path.resolve(__dirname, 'fixtures')

    fs.readdirSync(fixturesDir).map((caseName) => {
        it(`should ${caseName.split('-').join(' ')}`, () => {
            const fixtureDir = path.join(fixturesDir, caseName)
            const actualPath = path.join(fixtureDir, 'actual.js')
            const actual = build(actualPath, { usePolyfills: false, useBabel: !caseName.includes('es5') }).text

            const expected = fs.readFileSync(
                path.join(fixtureDir, 'expected.js')
            ).toString()

            expect(trim(actual)).to.equal(trim(expected))
        })
    })
})
