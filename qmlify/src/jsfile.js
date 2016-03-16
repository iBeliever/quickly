import {BaseFile} from './basefile'
import * as templates from './templates'
import * as babel from 'babel-core'

export class JSFile extends BaseFile {
    header = templates.header
    postHeader = templates.postHeader

    get globals() {
        return {}
    }

    transform() {
        if (this.qmlify.useBabel) {
            this.text = babel.transform(this.text, this.qmlify.babelOptions).code
        }

        this.postHeader = this.postHeader.replace('FILENAME', this.basename)

        this.transformRequires()

        this.text = this.text.trim()
        this.header = this.header.trim()
        this.postHeader = this.postHeader.trim()

        if (this.postHeader)
            this.text = this.postHeader + '\n\n' + this.text
        if (this.header)
            this.text = this.header + '\n\n' + this.text

        this.text += '\n'
    }

    transformRequires() {
        this.text = this.text.replace(templates.requireAs, (...args) => {
            return this.replaceRequire(...args)
        })

        this.text = this.text.replace(templates.requireSideEffects, (match, $1, ...args) => {
            this.replaceRequire(match, $1, null, ...args)
            return ''
        })

        this.text = this.text.replace(templates.require, (match, $1, ...args) => {
            return this.replaceRequire(match, $1, null, ...args)
        })

        while (this.text.includes('\n\n\n'))
            this.text = this.text.replace('\n\n\n', '\n\n')
    }

    replaceRequire(match, $1, $2) {
        const [importPath, importAs] = $2 ? [$2, $1] : [$1, null]

        const dependency = this.require(importPath)

        const qualifier = dependency.qualifier(importAs)
        const requireStatement = dependency.requireStatement(qualifier)

        this.header += dependency.importStatement(qualifier) + '\n'

        if (importAs) {
            return `var ${importAs} = ${requireStatement};`
        } else {
            return requireStatement
        }
    }

    addGlobals() {

    }
}
