Index: aurelia-polyfills/src/collections.js
===================================================================
--- aurelia-polyfills/src/collections.js
+++ aurelia-polyfills/src/collections.js
@@ -1,6 +1,6 @@
 .pragma library
-.import "../../aurelia-pal/dist/commonjs/aurelia-pal.js" as QML_aureliaPal
+.import "./symbol.js" as QML_symbol
 
 var __filename = Qt.resolvedUrl('collections.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -11,12 +11,12 @@
 function require(qualifier) {
     return qualifier.module ? qualifier.module.exports : qualifier;
 }
 
+var Symbol = QML_symbol.global.Symbol;
+
 'use strict';
 
-var _aureliaPal = require(QML_aureliaPal);
-
 function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
 
 (function (global) {
   //shared pointer
@@ -239,9 +239,9 @@
       if (r.done) break;
       callback.call(context, r.value[1], r.value[0], this);
     }
   }
-})(_aureliaPal.PLATFORM.global);
+})(global);
 
 var WeakMap = global.WeakMap;
 var Map = global.Map;
 var Set = global.Set;
