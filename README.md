QMLify
======

QMLify is a build tool which uses Babel to compile ES6 code into the standard ES5 Javascript that QML understands. Because QML uses its own syntax for imports, QMLify wraps Babel to transpile the `require`/`exports` code that Babel outputs into `.import` code that QML uses.

In addition to the `qmlify` transpiler, there is also a QML module called `QuickFill` which adds some polyfills to the QML JS environment, including extensions on `Array`, `String`, and `Object`, plus the `Symbol`, `Reflector`, and collection classes. The polyfill library is based on [Aurelia Polyfills](https://github.com/aurelia/polyfills) with some slight tweaks to work around the lack of globals support in QML.

The QuickFill library is automatically imported into your ES6 code by default, and requires no additional action on your part. To disable it, pass `--no-polyfills` to the `qmlify` script. To use the polyfills in QML, see the following example:

    import QtQuick 2.4
    import QuickFill 0.1

    Item {
        Component.onCompleted: {
            var set = new Polyfills.Set()

            set.add(4)
            set.add(5)
            set.add(4)

            console.log(set.size) // Prints 2
        }
    }

### Installation

To install the `qmlify` build tool and the `QuickFill` library, just run `make install` from the root of this repository.

### Build configuration

To use `qmlify`, you will need to the `babel` CLI installed globally using NPM:

    npm install -g babel-cli

You will need to add a `.babelrc` file to tell `babel` (used by `qmlify`) which transformations to apply. Here is a sample `.babelrc` file with ES6 and some additional features enabled:

    {
        "presets": ["es2015", "stage-0"],
        "plugins": [
            "transform-decorators-legacy"
        ]
    }

Based on the this config file, you will need the following NPM packages saved locally as dev dependencies:

    babel-preset-es2015
    babel-preset-stage-0
    babel-plugin-transform-decorators-legacy

Now just run `qmlify` on your src directory like this:

    qmlify src build

This will transpile all JS files and copy any other files to the `build` directory. Now, run or reference your main QML file from the `build` directory instead of the `src` directory.

Happy modern JSing!

### Upcoming features

 - Documentation on integrating with CMake and a C++ app (instead of simple QML)
 - Possible support for ES6 directly in QML
