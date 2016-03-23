Index: aurelia-polyfills/src/array.js
===================================================================
--- aurelia-polyfills/src/array.js
+++ aurelia-polyfills/src/array.js
@@ -1,5 +1,6 @@
 .pragma library
+.import "./symbol.js" as QML_symbol
 
 var __filename = Qt.resolvedUrl('array.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -10,8 +11,10 @@
 function require(qualifier) {
     return qualifier.module ? qualifier.module.exports : qualifier;
 }
 
+var Symbol = QML_symbol.global.Symbol;
+
 'use strict';
 
 if (!Array.from) {
   Array.from = function () {
