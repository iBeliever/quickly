Index: aurelia-polyfills/src/symbol.js
===================================================================
--- aurelia-polyfills/src/symbol.js
+++ aurelia-polyfills/src/symbol.js
@@ -1,6 +1,5 @@
 .pragma library
-.import "../../aurelia-pal/dist/commonjs/aurelia-pal.js" as QML_aureliaPal
 
 var __filename = Qt.resolvedUrl('symbol.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -11,21 +10,14 @@
 function require(qualifier) {
     return qualifier.module ? qualifier.module.exports : qualifier;
 }
 
-'use strict';
-
-var _aureliaPal = require(QML_aureliaPal);
-
 (function (Object, GOPS) {
-  'use strict';
-
   // (C) Andrea Giammarchi - Mit Style
 
   if (GOPS in Object) return;
 
   var setDescriptor,
-      G = _aureliaPal.PLATFORM.global,
       id = 0,
       random = '' + Math.random(),
       prefix = '__\x01symbol:',
       prefixLength = prefix.length,
@@ -104,11 +96,8 @@
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
@@ -128,20 +117,18 @@
       $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
     return gOPN(o).filter(onlySymbols).map(sourceMap);
   };
 
-  descriptor.value = $defineProperty;
-  defineProperty(Object, DP, descriptor);
+  Object.defineProperty = $defineProperty;
 
   descriptor.value = $getOwnPropertySymbols;
   defineProperty(Object, GOPS, descriptor);
 
-  descriptor.value = function getOwnPropertyNames(o) {
+  Object.getOwnPropertyNames = function getOwnPropertyNames(o) {
     return gOPN(o).filter(onlyNonSymbols);
   };
-  defineProperty(Object, GOPN, descriptor);
 
-  descriptor.value = function defineProperties(o, descriptors) {
+  Object.defineProperties = function defineProperties(o, descriptors) {
     var symbols = $getOwnPropertySymbols(descriptors);
     if (symbols.length) {
       keys(descriptors).concat(symbols).forEach(function (uid) {
         if (propertyIsEnumerable.call(descriptors, uid)) {
@@ -152,15 +139,13 @@
       defineProperties(o, descriptors);
     }
     return o;
   };
-  defineProperty(Object, DPies, descriptor);
 
   descriptor.value = propertyIsEnumerable;
   defineProperty(ObjectProto, PIE, descriptor);
 
-  descriptor.value = _Symbol;
-  defineProperty(G, 'Symbol', descriptor);
+  global.Symbol = _Symbol;
 
   // defining `Symbol.for(key)`
   descriptor.value = function (key) {
     var uid = prefix.concat(prefix, key, random);
@@ -173,21 +158,19 @@
     return hOP.call(source, symbol) ? symbol.slice(prefixLength * 2, -random.length) : void 0;
   };
   defineProperty(_Symbol, 'keyFor', descriptor);
 
-  descriptor.value = function getOwnPropertyDescriptor(o, key) {
+  Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(o, key) {
     var descriptor = gOPD(o, key);
     if (descriptor && onlySymbols(key)) {
       descriptor.enumerable = propertyIsEnumerable.call(o, key);
     }
     return descriptor;
   };
-  defineProperty(Object, GOPD, descriptor);
 
-  descriptor.value = function (proto, descriptors) {
+  Object.create = function (proto, descriptors) {
     return arguments.length === 1 ? create(proto) : createWithSymbols(proto, descriptors);
   };
-  defineProperty(Object, 'create', descriptor);
 
   descriptor.value = function () {
     var str = toString.call(this);
     return str === '[object String]' && onlySymbols(this) ? '[object Symbol]' : str;
@@ -210,8 +193,10 @@
     };
   }
 })(Object, 'getOwnPropertySymbols');
 
+var Symbol = global.Symbol;
+
 (function (O, S) {
   var dP = O.defineProperty,
       ObjectProto = O.prototype,
       toString = ObjectProto.toString,
@@ -232,15 +217,13 @@
     if (!(name in Symbol)) {
       dP(Symbol, name, { value: Symbol(name) });
       switch (name) {
         case toStringTag:
-          descriptor = O.getOwnPropertyDescriptor(ObjectProto, 'toString');
-          descriptor.value = function () {
+          ObjectProto.toString = function () {
             var str = toString.call(this),
                 tst = typeof this === 'undefined' || this === null ? undefined : this[Symbol.toStringTag];
             return typeof tst === 'undefined' ? str : '[object ' + tst + ']';
           };
-          dP(ObjectProto, 'toString', descriptor);
           break;
       }
     }
   });
