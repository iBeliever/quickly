.pragma library
.import "./global.js" as QML_global

var __filename = Qt.resolvedUrl('actual.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

var PI = QML_global.global.PI;

'use strict';

QML_global.module.exports;

console.log(PI);
