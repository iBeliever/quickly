import {expect} from 'chai'

import {BaseFile} from '../../src/basefile'
import path from 'path'

describe('BaseFile', function() {
    before('create a file', function() {
        this.file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })
    })

    describe('creating a file', function() {
        it('should return a file when passed a valid filename and a bundle', function() {
            const file = new BaseFile('src/index.js', { src_dirname: 'src' })

            expect(file).to.not.be.null
        })

        it('should throw an error when passed a filename outside of the bundle', function() {
            expect(() => {
                return new BaseFile('index.js', { src_dirname: 'src' })
            }).to.throw(Error)
        })

        it('should throw an error when passed a out_filename outside of the out_dirname', function() {
            expect(() => {
                return new BaseFile('index.js', { src_dirname: 'src', out_dirname: 'build' },
                                    { out_filename: '/build/index.js' })
            }).to.throw(Error)
        })

        it('should throw an error when not passed a filename', function() {
            expect(() => {
                return new BaseFile(null, { src_dirname: 'src' })
            }).to.throw(Error)
        })

        it('should throw an error when passed an empty filename', function() {
            expect(() => {
                return new BaseFile('', { src_dirname: 'src' })
            }).to.throw(Error)
        })

        it('should throw an error when not passed a bundle', function() {
            expect(() => {
                return new BaseFile('src/index.js')
            }).to.throw(Error)
        })

        it('should throw an error when passed a bundle without a src_dirname', function() {
            expect(() => {
                return new BaseFile('src/index.js', {})
            }).to.throw(Error)
        })
    })

    describe('.basename', function() {
        it('should be the name of the file', function() {
            expect(this.file.basename).to.equal('index.js')
        })
    })

    describe('.filename', function() {
        context('when out_filename and out_dirname were specified', function() {
            it('should be the out_filename relative to the out_dirname', function() {
                const file = new BaseFile('src/blah/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(file.filename).to.equal('blah/index.js')
            })
        })

        context('when out_filename was not specified', function() {
            it('should be the src_filename relative to the src_dirname', function() {
                const file = new BaseFile('src/index.js', { src_dirname: 'src' })

                expect(file.filename).to.equal('index.js')
            })
        })

        context('when out_dirname was not specified', function() {
            it('should be the src_filename relative to the src_dirname', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src' },
                                          { out_filename: 'out/filename.js'})

                expect(file.filename).to.equal('other/index.js')
            })
        })
    })

    describe('.src_filename', function() {
        it('should be relative to the current dirname if the passed in filename was not absolute', function() {
            const file = new BaseFile('src/index.js', { src_dirname: 'src', out_dirname: 'build' })

            expect(file.src_filename).to.equal(path.resolve('src/index.js'))
        })

        it('should be match the passed in filename if it was absolute', function() {
            const file = new BaseFile('/src/index.js', { src_dirname: '/src', out_dirname: 'build' })

            expect(file.src_filename).to.equal('/src/index.js')
        })
    })

    describe('.src_dirname', function() {
        it('should be the parent directory of src_filename', function() {
            expect(this.file.src_dirname).to.equal(path.resolve(path.dirname('src/other/index.js')))
        })

        it('should be an absolute path', function() {
            expect(path.isAbsolute(this.file.src_filename)).to.be.true
        })
    })

    describe('.out_filename', function() {
        context('in a bundle without an out_dirname', function() {
            it('should match the out_filename if it is passed in', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src' },
                                          { out_filename: 'build/index.js' })

                expect(file.out_filename).to.equal(path.resolve('build/index.js'))
            })

            it('should be null if no out_filename was passed in', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src' })

                expect(file.out_filename).to.be.null
            })
        })

        context('in a bundle with an out_dirname', function() {
            it('should be based on the src_filename if no out_filename was passed in', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(file.out_filename).to.equal(path.resolve('build/other/index.js'))
            })

            it('should match the out_filename if it is passed in', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' },
                                          { out_filename: 'build/index.js' })

                expect(file.out_filename).to.equal(path.resolve('build/index.js'))
            })
        })
    })

    describe('.out_dirname', function() {
        context('when out_filename is null', function() {
            it('should be null', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src' })

                expect(file.out_dirname).to.be.null
            })
        })

        context('when out_filename is not null', function() {
            it('should be the parent directory of out_filename', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' },
                                          { out_filename: 'build/test/index.js' })

                expect(file.out_dirname).to.equal(path.resolve('build/test'))
            })
            it('should be an absolute path', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' },
                                          { out_filename: 'build/test/index.js' })

                expect(path.isAbsolute(file.out_dirname)).to.be.true
            })
        })
    })

    describe('.relative()', function() {
        context('when out_dirname is null', function() {
            it('should return a path relative to src_dirname', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src' })

                expect(file.relative(path.resolve('src/test.js'))).to.equal('../test.js')
            })
        })

        context('when out_dirname is not null', function() {
            it('should return a path relative to out_dirname', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(file.relative(path.resolve('build/test.js'))).to.equal('../test.js')
            })
        })
    })

    describe('.resolve()', function() {
        context('when passed a relative path', function() {
            it('should return an absolute path based on src_dirname', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(file.resolve('../test.js')).to.equal(path.resolve('src/test.js'))
            })
        })

        context('when passed an absolute path inside src_dirname', function() {
            it('should return the original path', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(file.resolve(path.resolve('src/blah/index.js')))
                    .to.equal(path.resolve('src/blah/index.js'))
            })
        })

        context('when passed an absolute path outside of src_dirname', function() {
            it('should throw an error', function() {
                const file = new BaseFile('src/other/index.js', { src_dirname: 'src', out_dirname: 'build' })

                expect(() => {
                    return file.resolve('/blah/index.js')
                }).to.throw(Error)
            })
        })
    })
})
