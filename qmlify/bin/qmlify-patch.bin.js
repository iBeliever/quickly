#! /usr/bin/env node

var diff = require('diff')
var fs = require('fs')
var path = require('path')
var assert = require('assert')

var args = require('yargs')
    .usage('Usage: $0 filename original patched')
    .demand(2)
    .help('h')
    .alias('h', 'help')
    .argv



var filename = args._[0]
var orig_filename = args._[1]
var patched_filename = args._[2]

var patchFilename = path.resolve(__dirname, '../patches', filename)

var originalText = fs.readFileSync(orig_filename, 'utf-8')
var patchedText = fs.readFileSync(patched_filename, 'utf-8')

var patch = diff.createPatch(filename, originalText, patchedText)

assert.ok(diff.applyPatch(originalText, patch) == patchedText)

fs.writeFileSync(patchFilename, patch)
