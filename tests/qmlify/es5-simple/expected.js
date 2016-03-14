.pragma library
.import "./local.js" as QML_local

var __filename = Qt.resolvedUrl('actual.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;

var local = QML_local.module.exports;

local.test();
