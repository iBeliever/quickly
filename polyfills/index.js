.pragma library
.import "../dependencies/es6-promise/dist/es6-promise.js" as QML_es6Promise
.import "../dependencies/aurelia-polyfills/src/array.js" as QML_aurelia_polyfills_src_array
.import "../dependencies/aurelia-polyfills/src/collections.js" as QML_aurelia_polyfills_src_collections
.import "../dependencies/aurelia-polyfills/src/number.js" as QML_aurelia_polyfills_src_number
.import "../dependencies/aurelia-polyfills/src/object.js" as QML_aurelia_polyfills_src_object
.import "../dependencies/aurelia-polyfills/src/reflect.js" as QML_aurelia_polyfills_src_reflect
.import "../dependencies/aurelia-polyfills/src/string.js" as QML_aurelia_polyfills_src_string
.import "../dependencies/aurelia-polyfills/src/symbol.js" as QML_aurelia_polyfills_src_symbol
.import "../dependencies/whatwg-fetch/fetch.js" as QML_whatwg_fetch
.import "./timeout.js" as QML_timeout
.import "./string.js" as QML_string

var __filename = Qt.resolvedUrl('index.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

var WeakMap = global.WeakMap = QML_aurelia_polyfills_src_collections.global.WeakMap;
var Map = global.Map = QML_aurelia_polyfills_src_collections.global.Map;
var Set = global.Set = QML_aurelia_polyfills_src_collections.global.Set;
var WeakSet = global.WeakSet = QML_aurelia_polyfills_src_collections.global.WeakSet;
var Reflect = global.Reflect = QML_aurelia_polyfills_src_reflect.global.Reflect;
var Symbol = global.Symbol = QML_aurelia_polyfills_src_symbol.global.Symbol;
var Headers = global.Headers = QML_whatwg_fetch.global.Headers;
var Request = global.Request = QML_whatwg_fetch.global.Request;
var Response = global.Response = QML_whatwg_fetch.global.Response;
var fetch = global.fetch = QML_whatwg_fetch.global.fetch;
var setTimeout = global.setTimeout = QML_timeout.global.setTimeout;

'use strict';

var _es6Promise = require(QML_es6Promise);

global.Promise = _es6Promise.Promise; /*
                                       * Quickly - ES6 and Node.js-like environment for QML
                                       *
                                       * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
                                       *
                                       * This Source Code Form is subject to the terms of the Mozilla Public
                                       * License, v. 2.0. If a copy of the MPL was not distributed with this
                                       * file, You can obtain one at http://mozilla.org/MPL/2.0/.
                                       */

var Promise = global.Promise;
