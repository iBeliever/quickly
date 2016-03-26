.pragma library

var __filename = Qt.resolvedUrl('timeout.js').substring(7);
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
exports.setTimeout = setTimeout;
/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var timerComponent = Qt.createComponent(Qt.resolvedUrl('Timeout.qml'));

var TIMEOUT_IMMEDIATELY = 0;

function setTimeout(callback, timeout) {
    var timer = timerComponent.createObject();

    timer.interval = timeout || TIMEOUT_IMMEDIATELY;

    timer.triggered.connect(function () {
        timer.destroy();
        console.log('Calling back...');
        callback();
    });

    timer.start();
}

global.setTimeout = setTimeout;

var setTimeout = global.setTimeout;
var setTimeout = exports.setTimeout;
