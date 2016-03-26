.pragma library
.import "../dependencies/whatwg-fetch/fetch.js" as QML_whatwg_fetch

var __filename = Qt.resolvedUrl('http.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

var Headers = global.Headers = QML_whatwg_fetch.global.Headers;
var Request = global.Request = QML_whatwg_fetch.global.Request;
var Response = global.Response = QML_whatwg_fetch.global.Response;
var fetch = global.fetch = QML_whatwg_fetch.global.fetch;

'use strict';
