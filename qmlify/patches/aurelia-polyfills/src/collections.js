Index: aurelia-polyfills/src/collections.js
===================================================================
--- aurelia-polyfills/src/collections.js
+++ aurelia-polyfills/src/collections.js
@@ -1,5 +1,5 @@
-import {PLATFORM} from 'aurelia-pal';
+import './symbol';
 
 (function (global) {
   //shared pointer
   var i;
@@ -231,5 +231,5 @@
       callback.call(context, r.value[1], r.value[0], this);
     }
   }
 
-})(PLATFORM.global);
+})(global);
