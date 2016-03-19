Tutorial
========

Installing
----------

If you don't have ``qmlify`` installed yet, install it using ``npm``::

    $ npm install -g qmlify

Setting up Babel
----------------

Let's start by setting up the Babel configuration to transpile ES6 into standard JS. Create a file called `.babelrc` in your project's directory and put the following in it:

.. code-block:: json

    {
        "presets": ["es2015", "stage-0"],
        "plugins": [
            "transform-decorators-legacy"
        ]
    }

Now, install the ``babel`` command by running::

    $ npm install -g babel-cli

And install the Babel plugins and presets using::

    $ npm install --save-dev babel-preset-es2015 babel-preset-stage-0 babel-plugin-transform-decorators-legacy

You're all set up! Time to write some code!

Creating your first ES6 module
------------------------------

Let's start off with something simple. Create a file in ``src`` and call it ``app.js``::

    export class Person {
        constructor(name) {
            this.name = name
        }

        hello() {
            console.log(`Hello, ${this.name}!`)
        }
    }

Now create a QML file named ``main.qml``::

    import QtQuick 2.0
    import "app.js" as App

    Item {
        Component.onCompleted: {
            var person = new App.Person('Michael')
            person.hello() // Prints "Hello, Michael!"
        }
    }

Using polyfills
---------------

Let's get some fake users from <http://jsonplaceholder.typicode.com/>. In plain JS, you'd have to use XMLHttpRequest. With Quickly, you can use the fetch API. Add the following to your ``app.js`` file::

    export function getUsers() {
        return fetch('http://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
    }

And add the following code to your ``main.qml`` file, inside the ``Component.onCompleted`` block::

    App.getUsers().then(function(users) {
        var name = users[0].name
        console.log('The first user is: ' + name)
    })

Isn't that nicer and easier than XMLHttpRequest?

Using NodeJS core modules
-------------------------

Let's say we want to parse a URL and get the domain name. Easy, just add the following to your ``app.js`` file::

    import * as url from 'url'

    const data = url.parse('http://www.google.com')
    console.log(data.host) // prints 'www.google.com'

Using an NPM package
--------------------

`Lodash <https://github.com/lodash/lodash>`_ is a popular library for doing all sorts of useful stuff. The `chunk <https://lodash.com/docs#chunk>`_ method happens to be the first method in the documentation, so let's try that:

    import _ from 'lodash'

    const chunks = _.chunk(['a', 'b', 'c', 'd'], 3)
    // Returns [['a', 'b', 'c'], ['d']]
