Index: aurelia-polyfills/src/symbol.js
===================================================================
--- aurelia-polyfills/src/symbol.js
+++ aurelia-polyfills/src/symbol.js
@@ -1,15 +1,12 @@
-import {PLATFORM} from 'aurelia-pal';
+(function (Object, GOPS) {
 
-(function (Object, GOPS) {'use strict';
-
   // (C) Andrea Giammarchi - Mit Style
 
   if (GOPS in Object) return;
 
   var
     setDescriptor,
-    G = PLATFORM.global,
     id = 0,
     random = '' + Math.random(),
     prefix = '__\x01symbol:',
     prefixLength = prefix.length,
@@ -97,11 +94,8 @@
         sourceConstructor
       ));
     },
     Symbol = function Symbol(description) {
-      if (this && this !== G) {
-        throw new TypeError('Symbol is not a constructor');
-      }
       return setAndGetSymbol(
         prefix.concat(description || '', random, ++id)
       );
     },
@@ -125,20 +119,18 @@
       return gOPN(o).filter(onlySymbols).map(sourceMap);
     }
   ;
 
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
@@ -149,15 +141,13 @@
       $defineProperties(o, descriptors);
     }
     return o;
   };
-  defineProperty(Object, DPies, descriptor);
 
   descriptor.value = propertyIsEnumerable;
   defineProperty(ObjectProto, PIE, descriptor);
 
-  descriptor.value = Symbol;
-  defineProperty(G, 'Symbol', descriptor);
+  global.Symbol = Symbol;
 
   // defining `Symbol.for(key)`
   descriptor.value = function (key) {
     var uid = prefix.concat(prefix, key, random);
@@ -173,23 +163,21 @@
     ;
   };
   defineProperty(Symbol, 'keyFor', descriptor);
 
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
     return arguments.length === 1 ?
       create(proto) :
       createWithSymbols(proto, descriptors);
   };
-  defineProperty(Object, 'create', descriptor);
 
   descriptor.value = function () {
     var str = toString.call(this);
     return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
@@ -218,8 +206,10 @@
   }
 
 }(Object, 'getOwnPropertySymbols'));
 
+const Symbol = global.Symbol;
+
 (function (O, S) {
   var
     dP = O.defineProperty,
     ObjectProto = O.prototype,
@@ -243,17 +233,15 @@
     if (!(name in Symbol)) {
       dP(Symbol, name, {value: Symbol(name)});
       switch (name) {
         case toStringTag:
-          descriptor = O.getOwnPropertyDescriptor(ObjectProto, 'toString');
-          descriptor.value = function () {
+          ObjectProto.toString = function () {
             var
               str = toString.call(this),
               tst = typeof this === 'undefined' || this === null ? undefined : this[Symbol.toStringTag]
             ;
             return typeof tst === 'undefined' ? str : ('[object ' + tst + ']');
           };
-          dP(ObjectProto, 'toString', descriptor);
           break;
       }
     }
   });
