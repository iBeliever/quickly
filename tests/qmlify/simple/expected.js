.pragma library
.import "./local.js" as QML_local

var __filename = Qt.resolvedUrl('actual.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;

'use strict';

var _local = QML_local.module.exports;

(0, _local.test)();
