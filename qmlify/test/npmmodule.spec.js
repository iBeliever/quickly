import '../src'
import {expect} from 'chai'

import {Bundle} from '../src/bundle'
import {Package} from '../src/npmmodule'
import path from 'path'

describe('NPM Module', () => {
    const base_dirname = path.resolve(__dirname, '..', '..', 'quickly')
    const src_dirname = path.resolve(base_dirname, 'src')
    const out_dirname = path.resolve(base_dirname, 'build')

    context('for url', () => {
        const bundle = new Bundle(src_dirname, out_dirname)
        const module = new Package('url', bundle)

        it('should find the module', () => {
            expect(module.exists).to.be.true
        })

        it('should have the correct src_dirname', () => {
            expect(module.src_dirname).to.equal(path.join(base_dirname, 'node_modules', 'url'))
        })

        it('should have the correct out_dirname', () => {
            expect(module.out_dirname).to.equal(path.join(base_dirname, 'build', 'dependencies',
                                                          'url'))
        })

        it('should have the correct main filename', () => {
            expect(module.main_filename).to.equal('./url.js')
        })

        describe('building the main file', () => {
            const file = module.require()

            it('should not be null', () => {
                expect(file).to.not.be.null
            })

            it('should have the correct filename', () => {
                expect(file.filename).to.equal(path.join('dependencies', 'url', 'url.js'))
            })

            it('should have the correct src_filename', () => {
                expect(file.src_filename).to.equal(path.join(module.src_dirname, 'url.js'))
            })

            it('should have the correct out_filename', () => {
                expect(file.out_filename).to.equal(path.join(module.out_dirname, 'url.js'))
            })

            it('should add the file to the module', () => {
                expect(module.files).to.include.keys(file.filename)
            })

            it('should add the file to parent bundle', () => {
                expect(bundle.files).to.include.keys(file.filename)
            })
        })
    })

    context('for a non-existent module', () => {
        const bundle = new Bundle(src_dirname, out_dirname)
        const module = new Package('sfdsdf', bundle)

        it('should not find the module', () => {
            expect(module.exists).to.be.false
        })
    })
})
