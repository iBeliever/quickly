.pragma library
.import "./decode.js" as QML_decode
.import "./encode.js" as QML_encode

var __filename = Qt.resolvedUrl('index.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

'use strict';

exports.decode = exports.parse = require(QML_decode);
exports.encode = exports.stringify = require(QML_encode);
