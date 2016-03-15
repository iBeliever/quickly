(function() {
  let needsFix = false;

  //ES5 did not accept primitives, but ES6 does
  try {
    let s = Object.keys('a');
    needsFix = (s.length !== 1 || s[0] !== '0');
  } catch(e) {
    needsFix = true;
  }

  if (needsFix) {
    Object.keys = (function() {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;

      return function(obj) {
        if (obj === undefined || obj === null){
          throw TypeError(`Cannot convert undefined or null to object`);
        }

        obj = Object(obj);

        var result = [], prop, i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }

        return result;
      };
    }());
  }
}());

(function (O) {
  if ('assign' in O) {
    return;
  }

  O.defineProperty(O, 'assign', {
      configurable: true,
      writable: true,
      value: (function() {
        var gOPS = O.getOwnPropertySymbols,
            // shortcut without explicitly passing through prototype
            pIE = O.propertyIsEnumerable,
            filterOS = gOPS ?
              function (self) {
                return gOPS(self).filter(pIE, self);
              } : function () {
                // just empty Array won't do much within a .concat(...)
                return Array.prototype;
              };

        return function assign(where) {
          // Object.create(null) and null objects in general
          // might not be fully compatible with Symbols libraries
          // it is important to know this, in case you assign Symbols
          // to null object ... but it should NOT be a show-stopper
          // if you know what you are doing ... so ....
          if (gOPS && !(where instanceof O)) {
            console.warn('problematic Symbols', where);
            // ... now this script does its business !!!
          }
          // avoid JSHint "don't make function in loop"
          function set(keyOrSymbol) {
            where[keyOrSymbol] = arg[keyOrSymbol];
          }
          // the loop
          for (var i = 1, ii = arguments.length; i < ii; ++i) {
            var arg = arguments[i];

            if (arg === null || arg === undefined) {
              continue;
            }

            O.keys(arg).concat(filterOS(arg)).forEach(set);
          }

          return where;
        };
      }())
    });
}(Object));
