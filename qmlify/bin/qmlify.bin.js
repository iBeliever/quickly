#! /usr/bin/env node

var qmlify = require('../dist/index')

var args = require('yargs')
    .usage('Usage: $0 [options] source... build_dir')
    .demand(2)
    .default('babel', true)
    .describe('babel', 'Run Babel on the source files')
    .default('polyfills', true)
    .describe('polyfills', 'Include the Quickly polyfills library')
    .help('h')
    .alias('h', 'help')
    .argv

var source = args._.slice(0, -1)
var build_dir = args._.pop()

qmlify(source, build_dir, { polyfills: args.polyfills, babel: args.babel })

console.log(source, build_dir)
