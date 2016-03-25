import '../src'
import {expect} from 'chai'

import {Bundle} from '../src/bundle'
import path from 'path'

describe('Bundle', () => {
    const base_dirname = path.resolve(__dirname, 'bundle')
    const src_dirname = base_dirname
    const out_dirname = path.resolve(base_dirname, 'build')

    const bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })

    context('building a simple file', () => {
        const file = bundle.build('index.js')

        it('should not be null', () => {
            expect(file).to.not.be.null
        })

        it('should have the correct filename', () => {
            expect(file.filename).to.equal('index.js')
        })

        it('should have the correct src_filename', () => {
            expect(file.src_filename).to.equal(path.resolve(src_dirname, 'index.js'))
        })

        it('should have the correct src_dirname', () => {
            expect(file.src_dirname).to.equal(src_dirname)
        })

        it('should have the correct out_filename', () => {
            expect(file.out_filename).to.equal(path.resolve(out_dirname, 'index.js'))
        })

        it('should have the correct out_dirname', () => {
            expect(file.out_dirname).to.equal(out_dirname)
        })

        it('should add the file to the bundle', () => {
            expect(bundle.files).to.include.keys(file.filename)
        })

        it('should have no dependencies', () => {
            expect(file.dependencies).to.be.empty
        })

        it('should define the global PI', () => {
            expect(file.globals).to.have.members(['PI'])
        })
    })

    context('building a file in a subdirectory', () => {
        const file = bundle.build(path.join('subdir', 'index.js'))

        it('should not be null', () => {
            expect(file).to.not.be.null
        })

        it('should have the correct filename', () => {
            expect(file.filename).to.equal(path.join('subdir', 'index.js'))
        })

        it('should have the correct src_filename', () => {
            expect(file.src_filename).to.equal(path.resolve(src_dirname, 'subdir', 'index.js'))
        })

        it('should have the correct src_dirname', () => {
            expect(file.src_dirname).to.equal(path.resolve(src_dirname, 'subdir'))
        })

        it('should have the correct out_filename', () => {
            expect(file.out_filename).to.equal(path.resolve(out_dirname, 'subdir', 'index.js'))
        })

        it('should have the correct out_dirname', () => {
            expect(file.out_dirname).to.equal(path.resolve(out_dirname, 'subdir'))
        })

        it('should add the file to the bundle', () => {
            expect(bundle.files).to.include.keys(file.filename)
        })
    })
})
