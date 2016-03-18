.pragma library
.import "../dependencies/url/url.js" as QML_url

var __filename = Qt.resolvedUrl('url.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require(QML_url);

var parse = exports.parse = _url.parse;
var format = exports.format = _url.format;
var resolve = exports.resolve = _url.resolve;
