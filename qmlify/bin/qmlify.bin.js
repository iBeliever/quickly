#! /usr/bin/env node

var qmlify = require('../dist/index')

var args = require('yargs')
    .usage('Usage: $0 [options] source')
    .demand(1)
    .alias('d', 'out-dir')
    .describe('out-dir', 'The directory to output built files to')
    .alias('o', 'out-file')
    .describe('out-file', 'The file to output the built file to')
    .default('babel', true)
    .describe('babel', 'Run Babel on the source files')
    .default('polyfills', true)
    .describe('polyfills', 'Include the Quickly polyfills library')
    .help('h')
    .alias('h', 'help')
    .argv

var source = args._[0]
var options = { usePolyfills: args.polyfills, useBabel: args.babel }

if (args.outDir) {
    qmlify.build_dir(source, args.outDir, options)
} else {
    qmlify.build_file(source, args.outFile, options)
}
