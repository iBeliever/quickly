import '../../src'
import {expect} from 'chai'

import {Bundle} from '../../src/bundle'
import {ImportError} from '../../src/dependencies'
import path from 'path'

describe('Bundle', function() {
    describe('.src_dirname', function() {
        it('should be the specified path if one was passed in', function() {
            const bundle = new Bundle('src')
            expect(bundle.src_dirname).to.equal(path.resolve('src'))
        })

        it('should be the current working directory if no path was specified', function() {
            const bundle = new Bundle()
            expect(bundle.src_dirname).to.equal(path.resolve(''))
        })
    })

    describe('.rootBundle', function() {
        it('should be the current bundle if no parent was specified', function() {
            const bundle = new Bundle()
            expect(bundle.rootBundle).to.equal(bundle)
        })

        it('should be the parent bundle if one was specififed', function() {
            const parentBundle = new Bundle()
            const bundle = new Bundle(null, null, { parentBundle })
            expect(bundle.rootBundle).to.equal(parentBundle)
        })
    })

    describe('.bundleInfo', function() {
        context('when there is no qmldir info', function() {
            it('should return null', function() {
                const bundle = new Bundle()
                expect(bundle.bundleInfo).to.be.null
            })
        })

        context('when there is qmldir info', function() {
            before('create a bundle with qmldir info', function() {
                this.bundle = new Bundle()
                this.bundle.qmldir = {
                    moduleName: 'TestModule',
                    resources: {
                        'Test': {
                            latestVersion: '0.2',
                            filename: 'index.js'
                        }
                    }
                }
                this.bundle.config = {
                    exports: {
                        'test': 'TestModule/test'
                    }
                }
                this.bundle.files = {
                    'index.js': {
                        exportedGlobals: ['PI']
                    }
                }

                this.bundleInfo = this.bundle.bundleInfo
            })

            it('should have the correct name based on the qmldir', function() {
                expect(this.bundleInfo.name).to.equal('TestModule')
            })

            it('should have the exports listed in the config', function() {
                expect(this.bundleInfo.exports).to.deep.equal(this.bundle.config.exports)
            })

            it('should list all the exported globals', function() {
                expect(this.bundleInfo.globals).to.deep.equal({
                    'PI': 'Test'
                })
            })

            it('should list all the exported files', function() {
                expect(this.bundleInfo.resources).to.deep.equal({
                    'Test': {
                        'latestVersion': '0.2',
                        'globals': ['PI']
                    }
                })
            })
        })

        context('when the qmldir references a non-existent file', function() {
            before('create a bundle with qmldir info', function() {
                this.bundle = new Bundle()
                this.bundle.qmldir = {
                    moduleName: 'TestModule',
                    resources: {
                        'Test': {
                            latestVersion: '0.2',
                            filename: 'index.js'
                        }
                    }
                }
            })

            it('should throw an error', function() {
                expect(() => {
                    return this.bundle.bundleInfo
                }).to.throw(ImportError)
            })
        })
    })

    describe('.relative()', function() {

    })

    describe('.resolve()', function() {
        context('when passed a relative path', function() {
            it('should return an absolute path based on src_dirname', function() {
                const bundle = new Bundle('src')

                expect(bundle.resolve('other/test.js')).to.equal(path.resolve('src/other/test.js'))
            })
        })

        context('when passed an absolute path inside src_dirname', function() {
            it('should return the original path', function() {
                const bundle = new Bundle('src')

                expect(bundle.resolve(path.resolve('src/other/test.js')))
                    .to.equal(path.resolve('src/other/test.js'))
            })
        })

        context('when passed an absolute path outside of src_dirname', function() {
            it('should throw an error', function() {
                const bundle = new Bundle('src')

                expect(() => {
                    return bundle.resolve('/blah/index.js')
                }).to.throw(Error)
            })
        })
    })
})
