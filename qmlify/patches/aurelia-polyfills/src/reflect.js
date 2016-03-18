Index: aurelia-polyfills/src/reflect.js
===================================================================
--- aurelia-polyfills/src/reflect.js
+++ aurelia-polyfills/src/reflect.js
@@ -1,6 +1,5 @@
 .pragma library
-.import "../../aurelia-pal/dist/commonjs/aurelia-pal.js" as QML_aureliaPal
 
 var __filename = Qt.resolvedUrl('reflect.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -13,18 +12,19 @@
 }
 
 'use strict';
 
-var _aureliaPal = require(QML_aureliaPal);
 
 var emptyMetadata = Object.freeze({});
 var metadataContainerKey = '__metadata__';
 var bind = Function.prototype.bind;
 
-if (typeof _aureliaPal.PLATFORM.global.Reflect === 'undefined') {
-  _aureliaPal.PLATFORM.global.Reflect = {};
+if (typeof global.Reflect === 'undefined') {
+  global.Reflect = {};
 }
 
+var Reflect = global.Reflect;
+
 if (typeof Reflect.getOwnMetadata !== 'function') {
   Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
     return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
   };
