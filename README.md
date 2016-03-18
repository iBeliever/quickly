Quickly
=======

[![Join the chat at https://gitter.im/iBeliever/quickly](https://badges.gitter.im/iBeliever/quickly.svg)](https://gitter.im/iBeliever/quickly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Quickly is a build tool and QML module with provides an NodeJS-like ES6 environment for Javascript used in QML. The goal of the project is to allow you to write awesome modern ES6 Javascript taking advantage of classes, decorators, arrow functions, and best of all, many of the vast array of NPM packages available using the standard ES6 module imports. You can then take that code and use in directly from QML, just as you would with plain, old, QML-specific Javascript. You can even build a library using ES6 and NPM packages, and then distribute that as a standard QML module or QPM package for other developers to use in regular QML or QML-specific Javascript.

For those who would prefer to stick with standard QML-specific Javascript, you can also do that and still use the Quickly library, which gives you promises, the fetch API, and many polyfills. This is great for longtime QML developers or existing projects that just want to drop in some easy-to-use features from modern JS core libraries.

Check out the [documentation](http://quickly.readthedocs.org/en/latest/) for more details, usage, and API documentation.

### Examples

Write modern ES6 like this:

    import * as url from 'url'  // Use core Node modules

    const data = url.parse('http://www.google.com')

    // Use the Promise polyfill

    const promise = new Promise((resolve, reject) => {
        resolve('Why again did we need a promise here?')
    })

    // Use the Array.prototype.includes() poylfill

    const array = ['A', 'B', 'C']
    console.log(array.includes('B'))

    // Use ES6 classes

    export class Document {
        title = ''
        body = ''

        constructor(title, body) {
            this.title = title
            this.body = body
        }
    }

And compile that into JS that QML understands:

    import "file.js" as JS

    Item {
        Component.onCompleted: {
            var doc = new JS.Document('Hello, World', 'Contents')
        }
    }

### Licensing

**QMLify**

QMLify is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

**Quickly core modules**

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
