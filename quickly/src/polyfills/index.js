/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
