QMLify Transpiler
=================

Babel setup and basic usage
---------------------------

To use ``qmlify``, you will need to the ``babel`` CLI installed globally using NPM::

    $ npm install -g babel-cli

You will need to add a ``.babelrc`` file to tell ``babel`` (used by ``qmlify``) which transformations to apply. Here is a sample ``.babelrc`` file with ES6 and some additional features enabled:

.. code-block:: json

    {
        "presets": ["es2015", "stage-0"],
        "plugins": [
            "transform-decorators-legacy"
        ]
    }

Based on the this config file, you will need the following NPM packages saved locally as dev dependencies::

    babel-preset-es2015
    babel-preset-stage-0
    babel-plugin-transform-decorators-legacy

Now just run `qmlify` on your src directory like this::

    $ qmlify src build

This will transpile all JS files and copy any other files to the ``build`` directory. Now, run or reference your main QML file from the ``build`` directory instead of the `src` directory.

Usage without Babel
-------------------

Coming soon!

Integration with CMake
----------------------

Coming soon!
