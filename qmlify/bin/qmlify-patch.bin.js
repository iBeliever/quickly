#! /usr/bin/env node

var diff = require('diff')
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var findFile = require('../lib/util').findFile

var args = require('yargs')
    .usage('Usage: $0 filename [original patched]')
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .argv

var node_dirname = findFile('node_modules')

var filename = args._[0]
var orig_filename
var patched_filename

if (args._.length > 1) {
    orig_filename = args._[1]
    patched_filename = args._[2]
} else {
    var without_js = filename.split('.js', 1)[0]
    orig_filename = path.resolve(node_dirname, filename)
    patched_filename = path.resolve(node_dirname, without_js + '-patched.js')
}

var patchFilename = path.resolve(__dirname, '../patches', filename)

var originalText = fs.readFileSync(orig_filename, 'utf-8').trim() + '\n'
var patchedText = fs.readFileSync(patched_filename, 'utf-8').trim() + '\n'

var patch = diff.createPatch(filename, originalText, patchedText)

assert.ok(diff.applyPatch(originalText, patch) == patchedText)

fs.writeFileSync(patchFilename, patch)
