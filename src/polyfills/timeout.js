const timerComponent = Qt.createComponent(Qt.resolvedUrl('Timeout.qml'))

export function setTimeout(callback, timeout) {
    const timer = timerComponent.createObject()

    timer.interval = timeout || 0

    timer.triggered.connect(() => {
        timer.destroy()
        console.log('Calling back...')
        callback()
    })

    timer.start()
}

global.setTimeout = setTimeout
