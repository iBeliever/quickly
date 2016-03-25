/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const timerComponent = Qt.createComponent(Qt.resolvedUrl('Timeout.qml'))

const TIMEOUT_IMMEDIATELY = 0

export function setTimeout(callback, timeout) {
    const timer = timerComponent.createObject()

    timer.interval = timeout || TIMEOUT_IMMEDIATELY

    timer.triggered.connect(() => {
        timer.destroy()
        console.log('Calling back...')
        callback()
    })

    timer.start()
}

global.setTimeout = setTimeout
