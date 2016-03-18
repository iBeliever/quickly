Index: whatwg-fetch/fetch.js
===================================================================
--- whatwg-fetch/fetch.js
+++ whatwg-fetch/fetch.js
@@ -1,5 +1,6 @@
 .pragma library
+.import "../es6-promise/dist/es6-promise.js" as QML_promise
 
 var __filename = Qt.resolvedUrl('fetch.js').substring(7);
 var __dirname = __filename.substring(0, __filename.lastIndexOf('/'));
 
@@ -10,12 +11,14 @@
 function require(qualifier) {
     return qualifier.module ? qualifier.module.exports : qualifier;
 }
 
-(function(self) {
+var Promise = require(QML_promise).Promise;
+
+(function(global) {
   'use strict';
 
-  if (self.fetch) {
+  if (global.fetch) {
     return
   }
 
   function normalizeName(name) {
@@ -120,18 +123,18 @@
     return fileReaderReady(reader)
   }
 
   var support = {
-    blob: 'FileReader' in self && 'Blob' in self && (function() {
+    blob: 'FileReader' in global && 'Blob' in global && (function() {
       try {
         new Blob();
         return true
       } catch(e) {
         return false
       }
     })(),
-    formData: 'FormData' in self,
-    arrayBuffer: 'ArrayBuffer' in self
+    formData: 'FormData' in global,
+    arrayBuffer: 'ArrayBuffer' in global
   }
 
   function Body() {
     this.bodyUsed = false
@@ -331,13 +334,13 @@
 
     return new Response(null, {status: status, headers: {location: url}})
   }
 
-  self.Headers = Headers;
-  self.Request = Request;
-  self.Response = Response;
+  global.Headers = Headers;
+  global.Request = Request;
+  global.Response = Response;
 
-  self.fetch = function(input, init) {
+  global.fetch = function(input, init) {
     return new Promise(function(resolve, reject) {
       var request
       if (Request.prototype.isPrototypeOf(input) && !init) {
         request = input
@@ -359,26 +362,25 @@
 
         return;
       }
 
-      xhr.onload = function() {
-        var status = (xhr.status === 1223) ? 204 : xhr.status
-        if (status < 100 || status > 599) {
+      xhr.onreadystatechange = function() {
+        if (xhr.readyState === XMLHttpRequest.DONE) {
+          var options = {
+            status: xhr.status,
+            statusText: xhr.statusText,
+            headers: headers(xhr),
+            url: responseURL()
+          }
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
-        var body = 'response' in xhr ? xhr.response : xhr.responseText;
-        resolve(new Response(body, options))
       }
 
-      xhr.onerror = function() {
-        reject(new TypeError('Network request failed'))
+      xhr.ontimeout = function() {
+        reject(new TypeError('Network request timed out'))
       }
 
       xhr.open(request.method, request.url, true)
 
@@ -396,6 +398,11 @@
 
       xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
     })
   }
-  self.fetch.polyfill = true
-})(typeof self !== 'undefined' ? self : this);
+  global.fetch.polyfill = true
+})(global);
+
+var Headers = global.Headers;
+var Request = global.Request;
+var Response = global.Response;
+var fetch = global.fetch;
