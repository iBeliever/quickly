==========================
Quickly User Documentation
==========================

Quickly is a build tool and QML module with provides an NodeJS-like ES6 environment for Javascript used in QML. The goal of the project is to allow you to write awesome modern ES6 Javascript taking advantage of classes, decorators, arrow functions, and best of all, many of the vast array of NPM packages available using the standard ES6 module imports. You can then take that code and use in directly from QML, just as you would with plain, old, QML-specific Javascript. You can even build a library using ES6 and NPM packages, and then distribute that as a standard QML module or QPM package for other developers to use in regular QML or QML-specific Javascript.

For those who would prefer to stick with standard QML-specific Javascript, you can also do that and still use the Quickly library, which gives you promises, the fetch API, and many polyfills. This is great for longtime QML developers or existing projects that just want to drop in some easy-to-use features from modern JS core libraries.

:doc:`tutorial`
  A quick guide to get you up and running with Quickly.

:doc:`qmlify`
  How to use qmlify, the Quickly transpiler.

:doc:`corejs`
  How to use the core JS modules.

:doc:`distributing`
  Distributing your awesome new module for other developers to use.


Offline Reading
---------------

Download the docs in `pdf <https://media.readthedocs.org/pdf/quickly/latest/quickly.pdf>`_
or `epub <https://media.readthedocs.org/epub/quickly/latest/quickly.epub>`_
formats for offline reading.

.. toctree::
   :maxdepth: 2
   :hidden:

   tutorial
   qmlify
   corejs
   distributing


Indices and tables
------------------

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
