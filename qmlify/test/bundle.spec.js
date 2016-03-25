import '../src'
import {expect} from 'chai'

import {Bundle} from '../src/bundle'
import {ImportError} from '../src/dependencies'
import path from 'path'

describe('Bundle', function() {
    const base_dirname = path.resolve(__dirname, 'bundle')
    const src_dirname = base_dirname
    const out_dirname = path.resolve(base_dirname, 'build')

    describe('qmldir', function() {
        before('create the bundle', function() {
            this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
        })

        it('should not be null', function() {
            expect(this.bundle.qmldir).to.not.be.null
        })

        it('should have the correct module name', function() {
            expect(this.bundle.qmldir.moduleName).to.equal('TestModule')
        })

        it('should have the correct resources', function() {
            expect(this.bundle.qmldir.resources).to.deep.equal({
                'Test': {
                    'latestVersion': '0.1',
                    'filename': 'index.js'
                },
                'SubResource': {
                    'latestVersion': '2.4',
                    'filename': 'subdir/index.js'
                },
                'Lodash': {
                    'filename': 'dependencies/lodash/index.js',
                    'latestVersion': '0.1'
                }
            })
        })
    })

    describe('bundleInfo', function() {
        context('without building everything', function() {
            before('create the bundle', function() {
                this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
            })

            it('should throw an error', function() {
                expect(() => this.bundle.bundleInfo).to.throw(ImportError)
            })
        })

        context('after building everything', function() {
            before('create the bundle', function() {
                this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
            })

            before('build everything', function() {
                this.bundle.build_all()
            })

            it('should not throw an error', function() {
                expect(() => this.bundle.bundleInfo).to.not.throw(ImportError)
            })

            it('should have the correct name', function() {
                expect(this.bundle.bundleInfo['name']).to.equal('TestModule')
            })

            it('should have the correct globals', function() {
                expect(this.bundle.bundleInfo['globals']).to.deep.equal({
                    'PI': 'Test'
                })
            })

            it('should have the correct exports', function() {
                expect(this.bundle.bundleInfo['exports']).to.deep.equal({
                    'lodash': 'TestModule/Lodash'
                })
            })

            it('should have the correct resources', function() {
                expect(this.bundle.bundleInfo['resources']).to.deep.equal({
                    'Lodash': {
                        'globals': [],
                        'latestVersion': '0.1'
                    },
                    'SubResource': {
                        'globals': [],
                        'latestVersion': '2.4'
                    },
                    'Test': {
                        'globals': [ 'PI' ],
                        'latestVersion': '0.1'
                    }
                })
            })
        })
    })

    describe('build_all', function() {
        before('create the bundle', function() {
            this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
        })

        before('build everything', function() {
            this.bundle.build_all()
        })

        it('should have built the exported dependency', function() {
            expect(this.bundle.files).to.include.keys('dependencies/lodash/index.js')
        })

        it('should have built the simple file', function() {
            expect(this.bundle.files).to.include.keys('index.js')
        })

        it('should have built the subdir file', function() {
            expect(this.bundle.files).to.include.keys('subdir/index.js')
        })
    })

    describe('building a simple file', function() {
        before('create the bundle', function() {
            this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
        })

        before('build the file', function() {
            this.file = this.bundle.build('index.js')
        })

        it('should not be null', function() {
            expect(this.file).to.not.be.null
        })

        it('should have the correct filename', function() {
            expect(this.file.filename).to.equal('index.js')
        })

        it('should have the correct src_filename', function() {
            expect(this.file.src_filename).to.equal(path.resolve(src_dirname, 'index.js'))
        })

        it('should have the correct src_dirname', function() {
            expect(this.file.src_dirname).to.equal(src_dirname)
        })

        it('should have the correct out_filename', function() {
            expect(this.file.out_filename).to.equal(path.resolve(out_dirname, 'index.js'))
        })

        it('should have the correct out_dirname', function() {
            expect(this.file.out_dirname).to.equal(out_dirname)
        })

        it('should add the file to the bundle', function() {
            expect(this.bundle.files).to.include.keys(this.file.filename)
        })

        it('should have no dependencies', function() {
            expect(this.file.dependencies).to.be.empty
        })

        it('should define the global PI', function() {
            expect(this.file.globals).to.have.members(['PI'])
        })
    })

    describe('building a file in a subdirectory', function() {
        before('create the bundle', function() {
            this.bundle = new Bundle(src_dirname, out_dirname, { usePolyfills: false })
        })

        before('build the file', function() {
            this.file = this.bundle.build(path.join('subdir', 'index.js'))
        })

        it('should not be null', function() {
            expect(this.file).to.not.be.null
        })

        it('should have the correct filename', function() {
            expect(this.file.filename).to.equal(path.join('subdir', 'index.js'))
        })

        it('should have the correct src_filename', function() {
            expect(this.file.src_filename).to.equal(path.resolve(src_dirname, 'subdir', 'index.js'))
        })

        it('should have the correct src_dirname', function() {
            expect(this.file.src_dirname).to.equal(path.resolve(src_dirname, 'subdir'))
        })

        it('should have the correct out_filename', function() {
            expect(this.file.out_filename).to.equal(path.resolve(out_dirname, 'subdir', 'index.js'))
        })

        it('should have the correct out_dirname', function() {
            expect(this.file.out_dirname).to.equal(path.resolve(out_dirname, 'subdir'))
        })

        it('should add the file to the bundle', function() {
            expect(this.bundle.files).to.include.keys(this.file.filename)
        })
    })
})
