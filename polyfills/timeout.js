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
var timerComponent = Qt.createComponent(Qt.resolvedUrl('Timeout.qml'));

function setTimeout(callback, timeout) {
    var timer = timerComponent.createObject();

    timer.interval = timeout || 0;

    timer.triggered.connect(function () {
        timer.destroy();
        console.log('Calling back...');
        callback();
    });

    timer.start();
}

global.setTimeout = setTimeout;

var setTimeout = global.setTimeout;
