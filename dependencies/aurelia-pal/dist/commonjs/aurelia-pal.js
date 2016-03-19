.pragma library

var __filename = Qt.resolvedUrl('aurelia-pal.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

'use strict';

exports.__esModule = true;
exports.AggregateError = AggregateError;
exports.initializePAL = initializePAL;

function AggregateError(message, innerError, skipIfAlreadyAggregate) {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    if (innerError.stack) {
      message += '\n------------------------------------------------\ninner error: ' + innerError.stack;
    }
  }

  var e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

var FEATURE = {};

exports.FEATURE = FEATURE;
var PLATFORM = {
  noop: function noop() {},
  eachModule: function eachModule() {}
};

exports.PLATFORM = PLATFORM;
PLATFORM.global = (function () {
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return new Function('return this')();
})();

var DOM = {};

exports.DOM = DOM;

function initializePAL(callback) {
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  callback(PLATFORM, FEATURE, DOM);
}
