Index: whatwg-fetch/fetch.js
===================================================================
--- whatwg-fetch/fetch.js
+++ whatwg-fetch/fetch.js
@@ -1,8 +1,10 @@
-(function(self) {
+var Promise = require('es6-promise').Promise;
+
+(function(global) {
   'use strict';
 
-  if (self.fetch) {
+  if (global.fetch) {
     return
   }
 
   function normalizeName(name) {
@@ -107,18 +109,18 @@
     return fileReaderReady(reader)
   }
 
   var support = {
-    blob: 'FileReader' in self && 'Blob' in self && (function() {
+    blob: typeof FileReader !== 'undefined' && typeof Blob !== 'undefined' && (function() {
       try {
         new Blob()
         return true
       } catch(e) {
         return false
       }
     })(),
-    formData: 'FormData' in self,
-    arrayBuffer: 'ArrayBuffer' in self
+    formData: typeof FormData !== 'undefined',
+    arrayBuffer: typeof FileReader !== 'ArrayBuffer'
   }
 
   function Body() {
     this.bodyUsed = false
@@ -319,13 +321,13 @@
 
     return new Response(null, {status: status, headers: {location: url}})
   }
 
-  self.Headers = Headers
-  self.Request = Request
-  self.Response = Response
+  global.Headers = Headers
+  global.Request = Request
+  global.Response = Response
 
-  self.fetch = function(input, init) {
+  global.fetch = function(input, init) {
     return new Promise(function(resolve, reject) {
       var request
       if (Request.prototype.isPrototypeOf(input) && !init) {
         request = input
@@ -347,30 +349,33 @@
 
         return
       }
 
-      xhr.onload = function() {
-        var status = (xhr.status === 1223) ? 204 : xhr.status
-        if (status < 100 || status > 599) {
+      xhr.onreadystatechange = function() {
+        if (xhr.readyState === XMLHttpRequest.DONE) {
+          var status = (xhr.status === 1223) ? 204 : xhr.status
+
+          if (status < 100 || status > 599) {
+            reject(new TypeError('Network request failed'))
+            return
+          }
+
+          var options = {
+            status: xhr.status,
+            statusText: xhr.statusText,
+            headers: headers(xhr),
+            url: responseURL()
+          }
+
+          var body = 'response' in xhr ? xhr.response : xhr.responseText;
+          resolve(new Response(body, options))
+        } else if (xhr.readyState === XMLHttpRequest.ERROR) {
           reject(new TypeError('Network request failed'))
-          return
         }
-        var options = {
-          status: status,
-          statusText: xhr.statusText,
-          headers: headers(xhr),
-          url: responseURL()
-        }
-        var body = 'response' in xhr ? xhr.response : xhr.responseText
-        resolve(new Response(body, options))
       }
 
-      xhr.onerror = function() {
-        reject(new TypeError('Network request failed'))
-      }
-
       xhr.ontimeout = function() {
-        reject(new TypeError('Network request failed'))
+        reject(new TypeError('Network request timed out'))
       }
 
       xhr.open(request.method, request.url, true)
 
@@ -388,6 +393,6 @@
 
       xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
     })
   }
-  self.fetch.polyfill = true
-})(typeof self !== 'undefined' ? self : this);
+  global.fetch.polyfill = true
+})(global);
