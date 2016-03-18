--- original/querystring/decode.js
+++ patched/querystring/decode-patched.js
@@ -37,7 +37,7 @@
 // If obj.hasOwnProperty has been overridden, then calling
 // obj.hasOwnProperty(prop) will break.
 // See: https://github.com/joyent/node/issues/1707
-function hasOwnProperty(obj, prop) {
+function _hasOwnProperty(obj, prop) {
   return Object.prototype.hasOwnProperty.call(obj, prop);
 }

@@ -80,7 +80,7 @@
     k = decodeURIComponent(kstr);
     v = decodeURIComponent(vstr);

-    if (!hasOwnProperty(obj, k)) {
+    if (!_hasOwnProperty(obj, k)) {
       obj[k] = v;
     } else if (Array.isArray(obj[k])) {
       obj[k].push(v);
