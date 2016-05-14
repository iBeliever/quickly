Index: aurelia-polyfills/src/array.js
===================================================================
--- aurelia-polyfills/src/array.js
+++ aurelia-polyfills/src/array.js
@@ -1,4 +1,6 @@
+import './symbol'
+
 if (!Array.from) {
   Array.from = (function () {
     var toInteger = function(it) {
       return isNaN(it = +it) ? 0 : (it > 0 ? Math.floor : Math.ceil)(it);
