Quickly
=======

Quickly is a QML/JS library offering additional classes and methods that are part of the ES6 JS spec that QML's JS framework does not have. In addition, it offers several of the core modules that Node.js has.

The Quickly library is designed to be used with [QMLify](https://www.npmjs.com/package/qmlify) to offer a Node.js-like ES6 environment for Javascript used in QML. However, in can be used by itself to add the additional classes, methods, and core modules to a QML project.

Check out the [documentation](http://quickly.readthedocs.org/en/latest/) for more details, usage, and API documentation.

### Usage

Here are some sample uses:

    import QtQuick 2.4
    import Quickly 0.1

    Item {
        Component.onCompleted: {
            var set = new Polyfills.Set()
            set.add(4)
            set.add(2)
            set.add(4)
            console.log(set.size) // Prints 2

            var promise = new Promise.Promise(function(resolve, reject) {
                resolve("Why again did we need a promise here?")
            }).then(function(result) {
                console.log(result)
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

### Acknowledgements

  * The `url` module is from https://github.com/defunctzombie/node-url
  * The polyfills are from https://github.com/aurelia/polyfills, https://github.com/github/fetch, and https://github.com/stefanpenner/es6-promise

### Licensing

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
