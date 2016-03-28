.pragma library

var __filename = Qt.resolvedUrl('reflect.js').substring(7);
var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

var module = { exports: {} };
var exports = module.exports;
var global = {};

function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier;
}

'use strict';

var emptyMetadata = Object.freeze({});
var metadataContainerKey = '__metadata__';
var bind = Function.prototype.bind;

if (typeof Reflect === 'undefined') {
  global.Reflect = {};
}

var Reflect = global.Reflect || Reflect;

if (typeof Reflect.getOwnMetadata !== 'function') {
  Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
    return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
  };
}

if (typeof Reflect.defineMetadata !== 'function') {
  Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
    var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
    var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
    targetContainer[metadataKey] = metadataValue;
  };
}

if (typeof Reflect.metadata !== 'function') {
  Reflect.metadata = function (metadataKey, metadataValue) {
    return function (target, targetKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    };
  };
}

if (typeof Reflect.construct !== 'function') {
  Reflect.construct = function (Target, args) {
    if (args) {
      switch (args.length) {
        case 0:
          return new Target();
        case 1:
          return new Target(args[0]);
        case 2:
          return new Target(args[0], args[1]);
        case 3:
          return new Target(args[0], args[1], args[2]);
        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      }
    }

    var a = [null];
    a.push.apply(a, args);
    return new (bind.apply(Target, a))();
  };
}

var Reflect = global.Reflect;
