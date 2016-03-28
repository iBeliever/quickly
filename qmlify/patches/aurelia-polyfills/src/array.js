Index: aurelia-polyfills/src/array.js
===================================================================
--- aurelia-polyfills/src/array.js
+++ aurelia-polyfills/src/array.js
@@ -1,11 +1,13 @@
+import './symbol'
+
 if (!Array.from) {
   Array.from = (function () {
     var toInteger = function(it) {
       return isNaN(it = +it) ? 0 : (it > 0 ? Math.floor : Math.ceil)(it);
     };
-    var toLength = function(it) { 
-      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991 
+    var toLength = function(it) {
+      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
     };
     var iterCall = function(iter, fn, a1, a2) {
       try {
         fn(a1, a2);
