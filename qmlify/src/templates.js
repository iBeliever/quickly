export const header = `.pragma library\n`

export const postHeader = `
var __filename = Qt.resolvedUrl('FILENAME').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}\n`

export const requireAs = /^var ([\w\d_]+) = require\(["']([^"']+)["']\);$/mg
export const requireSideEffects = /^require\(["']([^"']+)["']\);$/mg
export const require = /require\(["']([^"']+)["']\)/mg
