Index: es6-promise/dist/es6-promise.js
===================================================================
--- es6-promise/dist/es6-promise.js
+++ es6-promise/dist/es6-promise.js
@@ -5,8 +5,10 @@
  *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
  * @version   3.1.2
  */
 
+require('./polyfills/timeout');
+
 (function() {
     "use strict";
     function lib$es6$promise$utils$$objectOrFunction(x) {
       return typeof x === 'function' || (typeof x === 'object' && x !== null);
@@ -57,54 +59,8 @@
     function lib$es6$promise$asap$$setAsap(asapFn) {
       lib$es6$promise$asap$$asap = asapFn;
     }
 
-    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
-    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
-    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
-    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
-
-    // test for web worker but not in IE10
-    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
-      typeof importScripts !== 'undefined' &&
-      typeof MessageChannel !== 'undefined';
-
-    // node
-    function lib$es6$promise$asap$$useNextTick() {
-      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
-      // see https://github.com/cujojs/when/issues/410 for details
-      return function() {
-        process.nextTick(lib$es6$promise$asap$$flush);
-      };
-    }
-
-    // vertx
-    function lib$es6$promise$asap$$useVertxTimer() {
-      return function() {
-        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
-      };
-    }
-
-    function lib$es6$promise$asap$$useMutationObserver() {
-      var iterations = 0;
-      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
-      var node = document.createTextNode('');
-      observer.observe(node, { characterData: true });
-
-      return function() {
-        node.data = (iterations = ++iterations % 2);
-      };
-    }
-
-    // web worker
-    function lib$es6$promise$asap$$useMessageChannel() {
-      var channel = new MessageChannel();
-      channel.port1.onmessage = lib$es6$promise$asap$$flush;
-      return function () {
-        channel.port2.postMessage(0);
-      };
-    }
-
     function lib$es6$promise$asap$$useSetTimeout() {
       return function() {
         setTimeout(lib$es6$promise$asap$$flush, 1);
       };
@@ -124,32 +80,10 @@
 
       lib$es6$promise$asap$$len = 0;
     }
 
-    function lib$es6$promise$asap$$attemptVertx() {
-      try {
-        var r = require;
-        var vertx = r('vertx');
-        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
-        return lib$es6$promise$asap$$useVertxTimer();
-      } catch(e) {
-        return lib$es6$promise$asap$$useSetTimeout();
-      }
-    }
+    var lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
 
-    var lib$es6$promise$asap$$scheduleFlush;
-    // Decide what async method to use to triggering processing of queued callbacks:
-    if (lib$es6$promise$asap$$isNode) {
-      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
-    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
-      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
-    } else if (lib$es6$promise$asap$$isWorker) {
-      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
-    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
-      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
-    } else {
-      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
-    }
     function lib$es6$promise$then$$then(onFulfillment, onRejection) {
       var parent = this;
       var state = parent._state;
 
@@ -939,15 +873,8 @@
       'Promise': lib$es6$promise$promise$$default,
       'polyfill': lib$es6$promise$polyfill$$default
     };
 
-    /* global define:true module:true window: true */
-    if (typeof define === 'function' && define['amd']) {
-      define(function() { return lib$es6$promise$umd$$ES6Promise; });
-    } else if (typeof module !== 'undefined' && module['exports']) {
-      module['exports'] = lib$es6$promise$umd$$ES6Promise;
-    } else if (typeof this !== 'undefined') {
-      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
-    }
+    module.exports = lib$es6$promise$umd$$ES6Promise;
 
     lib$es6$promise$polyfill$$default();
-}).call(this);
+}).call(exports);
