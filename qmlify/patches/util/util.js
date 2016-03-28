Index: util/util.js
===================================================================
--- util/util.js
+++ util/util.js
@@ -347,9 +347,9 @@
 
 function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
   var output = [];
   for (var i = 0, l = value.length; i < l; ++i) {
-    if (hasOwnProperty(value, String(i))) {
+    if (_hasOwnProperty(value, String(i))) {
       output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
           String(i), true));
     } else {
       output.push('');
@@ -378,9 +378,9 @@
     if (desc.set) {
       str = ctx.stylize('[Setter]', 'special');
     }
   }
-  if (!hasOwnProperty(visibleKeys, key)) {
+  if (!_hasOwnProperty(visibleKeys, key)) {
     name = '[' + key + ']';
   }
   if (!str) {
     if (ctx.seen.indexOf(desc.value) < 0) {
@@ -580,7 +580,7 @@
   }
   return origin;
 };
 
-function hasOwnProperty(obj, prop) {
+function _hasOwnProperty(obj, prop) {
   return Object.prototype.hasOwnProperty.call(obj, prop);
 }
