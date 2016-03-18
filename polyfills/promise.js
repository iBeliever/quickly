.pragma library
.import "../dependencies/es6-promise/dist/es6-promise.js" as QML_es6Promise

var __filename = Qt.resolvedUrl('promise.js').substring(7);
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
exports.race = exports.all = exports.reject = exports.resolve = exports.Promise = undefined;

var _es6Promise = require(QML_es6Promise);

var Promise = exports.Promise = _es6Promise.Promise;
var resolve = exports.resolve = _es6Promise.Promise.resolve;
var reject = exports.reject = _es6Promise.Promise.reject;
var all = exports.all = _es6Promise.Promise.all;
var race = exports.race = _es6Promise.Promise.race;
