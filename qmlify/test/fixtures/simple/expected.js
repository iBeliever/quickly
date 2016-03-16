.pragma library
.import "./local.js" as QML_local

var __filename = Qt.resolvedUrl('actual.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

'use strict';

var _local = require(QML_local);

(0, _local.test)();
