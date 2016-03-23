import 'aurelia-polyfills/src/array'
import 'aurelia-polyfills/src/collections'
import 'aurelia-polyfills/src/number'
import 'aurelia-polyfills/src/object'
import 'aurelia-polyfills/src/reflect'
import 'aurelia-polyfills/src/string'
import 'aurelia-polyfills/src/symbol'
import 'whatwg-fetch'

import './timeout'
import './string'

import {Promise} from 'es6-promise'

global.Promise = Promise
