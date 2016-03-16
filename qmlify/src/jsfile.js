import {BaseFile} from './basefile'
import * as babel from 'babel-core'

export class JSFile extends BaseFile {
    get globals() {
        return {}
    }

    transform() {
        if (this.qmlify.useBabel) {
            this.text = babel.transform(this.text, this.qmlify.babelOptions).code
        }

        console.log(this.text)
    }
}
