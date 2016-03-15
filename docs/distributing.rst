.. highlight:: js

========================
Distributing your Module
========================

In QML, you might have a JS library file named ``test.js`` that looks like this::

    .pragma library

    function test() {
        console.log('test')
    }

Along with the corresponding ``qmldir`` file::

    module ExampleModule

    Test 0.1 test.js

If you wanted to use the ``test()`` function in another JS file in your app or in another QML module, you'd do something like this::

    .pragma library
    .import ExampleModule 0.1 as Example

    Example.Test.test()

In ES6, you would do something like this::

    // test.js
    export function test() {
        console.log('test')
    }

And use it in your file like this::

    import {test} from 'test'

    test()

To bridge the gap between the QML way of doing things and the ES6 style, ``qmlify`` lets you "export" specific files from QML modules as ES6 modules. To implement the previous example in QMLified ES6, you'd do something like this::

    // test.js
    export function test() {
        console.log('test')
    }

    // qmldir
    module ExampleModule

    Test 0.1 test.js

    // package.yml
    exports:
        test: ExampleModule/Test

Optionally, you can specify the default or latest version in the export::

    // package.yml
    exports:
        test: ExampleModule/Test 0.1

And install the ``package.yml`` file along side the ``qmldir`` and QML/JS files. Now in your app you'd do the following::

    // app.js
    import {test} from 'test'

    test()

    // package.yml
    dependencies:
       test: 0.1

If a default version is available and you want to use that, you can leave the dependency out of the ``package.yml`` file.

Note that the ``package.yml`` is used to both list dependencies and/or exports, depending on your needs. To see all available QMLified modules, run::

    $ qmlify --modules
