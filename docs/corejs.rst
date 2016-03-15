.. highlight:: js

===============
Core JS Modules
===============

Quickly provides a polyfills library and a set of the core NodeJS modules for use in your JS or QML code.

Polyfills
--------

The following pollyfills are included (links are to documentation, usually on MDN):

  - Array.from
  - Array.prototype.find
  - Array.prototype.findIndex
  - Array.prototype.includes
  - Number.isNaN
  - Number.isFinite
  - Object.assign
  - String.prototype.endsWith
  - String.prototype.startsWith
  - String.prototype.includes
  - WeakMap, Map, WeakSet, and Set
  - `Reflect <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect>`_
  - `Symbol <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol>`_
  - `Promise <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>`_
  - `fetch, Request, Response, Headers <https://github.com/github/fetch#usage>`_

Core Modules
------------

  - url

Usage
-----

Depending on whether you're working in ES6, plain JS, or QML, there are different ways to use the Quickly core modules. ES6 is definitely the easiest, so we doing as much work as you can from ES6 wherever you can.

Using from QMLified ES6
~~~~~~~~~~~~~~~~~~~~~~~

This is the easiest way to use the core modules. All the polyfills are available on the global scope, so use them just as you would with a built-in class in QML/JS. The polyfilled methods are added directly to Array, Object, etc::

    const promise = new Promise((resolve, reject) => {
        promise.resolve('Hmm, why again did we need a promise here?')
    })

    promise.then((response) => {
        console.log(response)
    })

To use the core NodeJS modules simply import them as you would with any ES6 module::

    import * as url from 'url'

    const data = url.parse('http://www.google.com/search?q=Quickly')

Using from standard Javascript
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Using from standard Javascript is a bit more complicated. You will need to import the Quickly QML module. The polyfills are on a Polyfills type, although the fetch API is also on the Http type for convenience::

    .pragma library
    .import Quickly 0.1 as Quickly

    // This saves typing, but isn't necessary
    var Polyfills = Quickly.Polyfills
    var Promise = Quickly.Polyfills.Promise
    var Http = Quickly.Http
    var Url = Quickly.Url

    var promise = new Promise(function(resolve, reject) {
        var set = new Polyfills.Set()
        resolve(set)
    })

    Http.fetch('http://www.google.com')
        .then(function(response) {
            return response.text()
        }).then(function(text) {
            console.log(text)
        })

    var url = Url.parse('http://www.google.com')


Using from QML
~~~~~~~~~~~~~~

Like with standard JS, the polyfills and core modules are available via the Quickly QML module:

.. code-block:: qml

    import QtQuick 2.4
    import Quickly 0.1

    Item {
        Component.onCompleted: {
            var promise = new Promise.Promise(function(resolve, reject) {
                var set = new Polyfills.Set()
                resolve(set)
            })

            Http.fetch('http://www.google.com')
                .then(function(response) {
                    return response.text()
                }).then(function(text) {
                    console.log(text)
                })

            var url = Url.parse('http://www.google.com')
        }
    }
