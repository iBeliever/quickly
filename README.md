QMLify
======

QMLify is a build tool which uses Babel to compile ES6 code into the standard ES5 Javascript that QML understands. Because QML uses its own syntax for imports, QMLify wraps Babel to transpile the `require`/`exports` code that Babel outputs into `.import` code that QML uses.

In addition to the `qmlify` transpiler, there is also a QML module called `QuickFill` which adds some pollyfills to the QML JS environment, including extensions on `Array`, `String`, and `Object`, plus the `Symbol`, `Reflector`, and collection classes. The pollyfill library is based on [Aurelia Pollyfills](https://github.com/aurelia/polyfills) with some slight tweaks to work around the lack of globals support in QML.

The QuickFill library is automatically imported into your ES6 code by default, and requires no additional action on your part. To disable it, pass `--no-pollyfills` to the `qmlify` script. To use the pollyfills in QML, see the following example:

    import QtQuick 2.4
    import QuickFill 0.1

    Item {
        Component.onCompleted: {
            var set = new Pollyfills.Set()

            set.add(4)
            set.add(5)
            set.add(4)

            console.log(set.size) // Prints 2
        }
    }

Happy modern JSing!
