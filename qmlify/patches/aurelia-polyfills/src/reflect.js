Index: aurelia-polyfills/src/reflect.js
===================================================================
--- aurelia-polyfills/src/reflect.js
+++ aurelia-polyfills/src/reflect.js
@@ -1,14 +1,14 @@
-import {PLATFORM} from 'aurelia-pal';
-
 const emptyMetadata = Object.freeze({});
 const metadataContainerKey = '__metadata__';
 const bind = Function.prototype.bind;
 
-if (typeof PLATFORM.global.Reflect === 'undefined') {
-  PLATFORM.global.Reflect = {};
+if (typeof Reflect === 'undefined') {
+  global.Reflect = {};
 }
 
+const Reflect = global.Reflect || Reflect;
+
 if (typeof Reflect.getOwnMetadata !== 'function') {
   Reflect.getOwnMetadata = function(metadataKey, target, targetKey) {
     if (target.hasOwnProperty(metadataContainerKey)) {
       return (target[metadataContainerKey][targetKey] || emptyMetadata)[metadataKey];
