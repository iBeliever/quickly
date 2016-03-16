.pragma library

var __filename = Qt.resolvedUrl('actual.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

"use strict";

global.PI = 3.1415;

var PI = global.PI;
