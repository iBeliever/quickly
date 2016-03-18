Index: aurelia-polyfills/src/symbol.js
===================================================================
--- aurelia-polyfills/src/symbol.js
+++ aurelia-polyfills/src/symbol.js
@@ -1,6 +1,5 @@
 .pragma library
-.import "../../aurelia-pal/dist/commonjs/aurelia-pal.js" as QML_aureliaPal
 
 var __filename = Qt.resolvedUrl('symbol.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -13,19 +12,16 @@
 }
 
 'use strict';
 
-var _aureliaPal = require(QML_aureliaPal);
-
 (function (Object, GOPS) {
   'use strict';
 
   // (C) Andrea Giammarchi - Mit Style
 
   if (GOPS in Object) return;
 
   var setDescriptor,
-      G = _aureliaPal.PLATFORM.global,
       id = 0,
       random = '' + Math.random(),
       prefix = '__\x01symbol:',
       prefixLength = prefix.length,
@@ -104,11 +100,8 @@
     defineProperty(ObjectProto, uid, descriptor);
     return source[uid] = defineProperty(Object(uid), 'constructor', sourceConstructor);
   },
       _Symbol = function _Symbol2(description) {
-    if (this && this !== G) {
-      throw new TypeError('Symbol is not a constructor');
-    }
     return setAndGetSymbol(prefix.concat(description || '', random, ++id));
   },
       source = create(null),
       sourceConstructor = { value: _Symbol },
@@ -157,10 +150,9 @@
 
   descriptor.value = propertyIsEnumerable;
   defineProperty(ObjectProto, PIE, descriptor);
 
-  descriptor.value = _Symbol;
-  defineProperty(G, 'Symbol', descriptor);
+  global.Symbol = _Symbol;
 
   // defining `Symbol.for(key)`
   descriptor.value = function (key) {
     var uid = prefix.concat(prefix, key, random);
@@ -210,8 +202,10 @@
     };
   }
 })(Object, 'getOwnPropertySymbols');
 
+var Symbol = global.Symbol;
+
 (function (O, S) {
   var dP = O.defineProperty,
       ObjectProto = O.prototype,
       toString = ObjectProto.toString,
