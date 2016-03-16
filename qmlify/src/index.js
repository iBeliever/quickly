import {build, Bundle} from './bundle'
import 'babel-polyfill'
import 'source-map-support/register'

export {build, Bundle} from './bundle'

export function build_dir(src_dirname, out_dirname, options) {
    const bundle = new Bundle(src_dirname, out_dirname, options)

    bundle.build_all()

    bundle.save()
}

export function build_file(src_filename, out_filename, options) {
    if (!options)
        options = {}
    options['out_filename'] = out_filename

    const file = build(src_filename, options)

    if (out_filename)
        file.save(out_filename)
    else
        file.dump()
}
